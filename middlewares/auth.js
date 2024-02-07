const jwt = require("jsonwebtoken");
const User = require("../models/user");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized" });
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    try {
      if (err) {
        return res.status(401).send({ message: "Not authorized" });
      }

      const user = await User.findById(decode.id);

      if (user === null) {
        return res.status(401).send({ message: "Not authorized" });
      }

      if (user.token !== token) {
        return res.status(401).send({ message: "Not authorized" });
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  });
}

module.exports = auth;
