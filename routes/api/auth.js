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
  "/avatar",
  uploadMiddleware.single("avatar"),
  AuthMiddleware,
  AuthController.uploadAvatar
);

router.get("/avatar", AuthMiddleware, AuthController.getAvatar);

module.exports = router;
