const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const gravatar = require("gravatar");
const path = require("path");
const fs = require("fs/promises");
const jimp = require("../utils/jimp");
const { HttpError, sendEmail } = require("../utils/index");
const crypto = require("node:crypto");
const { BASE_URL } = process.env;

const avatarsDir = path.resolve("public/avatars");

async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }
    const passHash = await bcrypt.hash(password, 10);
    const avatarURL = gravatar.url(email);
    const verificationToken = crypto.randomUUID();

    const newUser = await User.create({
      ...req.body,
      password: passHash,
      avatarURL,
      verificationToken,
    });

    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res
      .status(201)
      .send({ user: { email, subscription: newUser.subscription } });
  } catch (error) {
    next(error);
  }
}

const verifyEmail = async (req, res, next) => {
  try {
    const { verificationToken } = req.params;
    const user = await User.findOne({ verificationToken: verificationToken });
    if (user === null) {
      throw HttpError(404, "User not found");
    }
    await User.findByIdAndUpdate(user._id, {
      verify: true,
      verificationToken: null,
    });
    res.json({
      message: "Verification successful",
    });
  } catch (error) {
    next(error);
  }
};

const resendVerifyEmail = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user === null) {
      throw HttpError(400, "missing required field email");
    }

    if (user.verify) {
      throw HttpError(400, "Verification has already been passed");
    }
    const verifyEmail = {
      to: email,
      subject: "Verify email",
      html: `<a target="_blank" href="${BASE_URL}/api/users/verify/${user.verificationToken}">Click verify email</a>`,
    };

    await sendEmail(verifyEmail);

    res.json({ message: "Verification email sent" });
  } catch (error) {
    next(error);
  }
};

async function login(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    if (user.verify === false) {
      throw HttpError(401, "Email is not verified");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await User.findByIdAndUpdate(user._id, { token });

    res.send({
      token,
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: " " });

    res.status(204).send("Logout success");
  } catch (error) {
    next(error);
  }
}

function current(req, res) {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
}

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    if (req.file === undefined)
      throw HttpError(404, "Image was not found, check form-data values");
    const { path: tempUpload, originalname } = req.file;
    await jimp(tempUpload);
    const fileName = `${_id}${originalname}`;
    const resultUpload = path.join(avatarsDir, fileName);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("/avatars", fileName);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  logout,
  current,
  updateAvatar,
  verifyEmail,
  resendVerifyEmail,
};
