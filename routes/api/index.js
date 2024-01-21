const express = require("express");

const router = express.Router();

const contactRouter = require("./contacts");
const authRouter = require("./auth");

router.use("/contacts", contactRouter);
router.use("/auth", authRouter);

module.exports = router;
