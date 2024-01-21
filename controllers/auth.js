const User = require("../models/user");
const bcrypt = require("bcrypt");

async function register(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: "Email in use" });
    }
    const passHash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: passHash });
    res
      .status(201)
      .send({ user: { email, subscription: newUser.subscription } });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  const { email, password, subscription } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user === null) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: "Email or password is wrong" });
    }
    res.send({
      token: "exampletoken",
      user: {
        email,
        subscription: user.subscription,
      },
    });
  } catch (error) {}
}

module.exports = { register, login };
