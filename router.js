const express = require("express");

const authRouter = require("./auth/authRouter.js");
const teacherRouter = require("./teacher/router/index.js");
const studentRouter = require("./student/router/index.js");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/teacher", teacherRouter);
router.use("/student", studentRouter);

module.exports = router;
