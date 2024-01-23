const express = require("express");

const AuthController = require("../../controllers/auth");
const router = express.Router();

router.get("/current", AuthController.current);

module.exports = router;
