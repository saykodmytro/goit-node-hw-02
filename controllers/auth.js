const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

function uploadAvatar(req, res) {
  res.send("Avatar");
}

module.exports = { register, login, logout, current, uploadAvatar };
