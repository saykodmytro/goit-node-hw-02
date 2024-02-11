const express = require("express");

const AuthController = require("../../controllers/auth");
const AuthMiddleware = require("../../middlewares/auth");

const uploadMiddleware = require("../../middlewares/upload");

const router = express.Router();
const jsonParser = express.json();

const { validateBody } = require("../../middlewares/index");
const {
  userRegisterSchema,
  userLoginSchema,
  emailSchema,
} = require("../../contactsSchemas/auth");

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

router.get("/current", AuthMiddleware, AuthController.current);

router.post("/logout", AuthMiddleware, AuthController.logout);

router.patch(
  "/avatars",
  AuthMiddleware,
  uploadMiddleware.single("avatar"),
  AuthController.updateAvatar
);

router.get("/verify/:verifyToken", AuthController.verifyEmail);
router.post(
  "/verify",
  validateBody(emailSchema),
  AuthController.resendVerifyEmail
);

module.exports = router;
