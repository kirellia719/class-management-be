const express = require("express");

const authController = require("./authController.js");
const profileController = require("./profileController.js");

const router = express.Router();

router.post("/login", authController.login);
router.get("/me", authController.getCurrentUser);
router.get("/avatar", profileController.getAllAvatars);
router.put("/change-avatar", authController.authenticate, profileController.changeAvatar);

module.exports = router;
