const express = require("express");
const { authenticate } = require("../../auth/authController.js");
const examController = require("../controllers/examController.js");

const router = express.Router();

router.get("/:examId", authenticate, examController.checkExam);
router.post("/:examId/join", authenticate, examController.joinExam);
router.get("/submit/:submissionId", authenticate, examController.getExamForSubmission);
router.post("/submit/:submissionId", authenticate, examController.submitExam);

module.exports = router;
