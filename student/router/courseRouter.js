const express = require("express");
const { authenticate } = require("../../auth/authController.js");
const courseController = require("../controllers/courseController.js");

const router = express.Router();

router.get("/all", authenticate, courseController.getAllCourses);
router.get("/:courseId/all-exams", authenticate, courseController.getExamsInCourse);

module.exports = router;
