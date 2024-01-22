const express = require("express");

const AuthController = require("../../controllers/auth");
const authMiddleware = require("../../middlewares/auth");

const { validateBody } = require("../../middlewares/index");
const {
  userRegisterSchema,
  userLoginSchema,
} = require("../../contactsSchemas/auth");

const router = express.Router();
const jsonParser = express.json();

router.post(
  "/register",
  jsonParser,
  validateBody(userRegisterSchema),
  AuthController.register
);

router.post(
  "/login",
  jsonParser,
  validateBody(userLoginSchema),
  AuthController.login
);

router.post("/logout", authMiddleware, AuthController.logOut);

module.exports = router;
