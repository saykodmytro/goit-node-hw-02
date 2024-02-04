const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs = require("node:fs/promises");
const path = require("node:path");
const { func } = require("joi");

async function register(req, res, next) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }
    const passHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ ...req.body, password: passHash });

    res
      .status(201)
      .send({ user: { email, subscription: newUser.subscription } });
  } catch (error) {
    next(error);
  }
}

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
  } catch (error) {}
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

async function uploadAvatar(req, res, next) {
  try {
    await fs.rename(
      req.file.path,
      path.join(__dirname, "..", "public/avatars", req.file.filename)
    );

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { avatar: req.file.filename },
      { new: true }
    );

    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }

    res.send(user);
  } catch (error) {
    next(error);
  }
}

async function getAvatar(req, res, next) {
  // res.send("get avatar");
  try {
    const user = await User.findById(req.user.id);
    console.log("user: ", user);
    if (user === null) {
      return res.status(404).send({ message: "User not found" });
    }
    if (user.avatar === null) {
      return res.status(404).send({ message: "Avatar not found" });
    }
    res.sendFile(path.join(__dirname, "..", "public/avatars", user.avatar));
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, current, uploadAvatar, getAvatar };
