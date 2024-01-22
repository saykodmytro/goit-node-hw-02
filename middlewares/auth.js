const jwt = require("jsonwebtoken");
const User = require("../models/user");

async function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized" });
  }

  try {
    const { id } = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(id);
    if (!user) {
      return res.status(401).send({ message: "Not authorized" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).send({ message: "Not authorized" });
  }
}

module.exports = auth;
