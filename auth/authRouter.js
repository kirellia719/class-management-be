const express = require("express");

const authController = require("./authController.js");

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", authController.getCurrentUser);

module.exports = router;
