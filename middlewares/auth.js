const jwt = require("jsonwebtoken");
const User = require("../models/user");

function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  console.log("authHeader: ", authHeader);

  if (typeof authHeader === "undefined") {
    return res.status(401).send({ message: "Not authorized" });
  }

  const [bearer, token] = authHeader.split(" ", 2);
  if (bearer !== "Bearer") {
    return res.status(401).send({ message: "Not authorized" });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, async (err, decode) => {
      console.log("decode: ", decode);
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

      req.user = {
        id: decode.id,
      };
      console.log("req.user: ", req.user);
      next();
    });
  } catch (error) {}
}

module.exports = auth;
