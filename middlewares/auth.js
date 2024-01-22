const jwt = require("jsonwebtoken");

const User = require("../models/user");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("authHeader: ", authHeader);

  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Invalid token 1" });
  }

  const [bearer, token] = authHeader.split(" ", 2);
  console.log("token: ", token);
  console.log("bearer: ", bearer);

  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Invalid token 2" });
  }

  // ******************************
  jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
    if (err) {
      return res.status(401).send({ message: "Invalid token 3" });
    }

    const user = await User.findById(decode.id);
    console.log("user: ", user);

    if (user === null) {
      console.log("user: ", user);
      return res.status(401).send({ message: "Invalid token 4" });
    }

    if (user.token !== token) {
      console.log("user.token: ", user.token);

      res.status(401).send({ message: "Invalid token 5" });
      return;
    }

    req.user = {
      id: decode.id,
    };

    next();
  });
}

module.exports = auth;
