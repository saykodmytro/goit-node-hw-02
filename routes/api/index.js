const express = require("express");

const router = express.Router();

const contactRouter = require("./contacts");
const authRouter = require("./auth");
const currentUser = require("./user");
const authMiddleware = require("../../middlewares/auth");

router.use("/auth", authRouter);
router.use("/users", authMiddleware, currentUser);
router.use("/contacts", authMiddleware, contactRouter);

module.exports = router;
