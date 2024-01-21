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

  jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Not authorized" });
    }

    req.user = {
      id: decode.id,
    };

    next();
  });
}

module.exports = auth;
