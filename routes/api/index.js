const express = require("express");

const router = express.Router();

const contactRouter = require("./contacts");
const authRouter = require("./auth");
const authMiddleware = require("../../middlewares/auth");

router.use("/users", authRouter);
router.use("/contacts", authMiddleware, contactRouter);

module.exports = router;
