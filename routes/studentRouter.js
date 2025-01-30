const express = require("express");
const { authenticate } = require("../controllers/authController.js");
const studentController = require("../controllers/studentController.js");

const router = express.Router();

router.get("/:courseId", authenticate, studentController.getStudents);
router.post("/:courseId", authenticate, studentController.addStudent);
router.put("/password/:studentId", authenticate, studentController.changePassword);
router.put("/:studentId", authenticate, studentController.updateStudent);
router.delete("/:studentId", authenticate, studentController.deleteStudent);

module.exports = router;
