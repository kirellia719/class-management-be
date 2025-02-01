const express = require("express");
const { authenticate } = require("../../auth/authController.js");
const examController = require("../controllers/examController.js");

const router = express.Router();

router.post("/", authenticate, examController.createExam);
router.get("/all", authenticate, examController.getExams);

module.exports = router;
