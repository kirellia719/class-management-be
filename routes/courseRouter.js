const express = require("express");
const { authenticate } = require("../controllers/authController.js");
const courseController = require("../controllers/courseController.js");

const router = express.Router();

router.post("/", authenticate, courseController.createCourse);
router.get("/all", authenticate, courseController.getCourses);

module.exports = router;
