const express = require("express");

const courseRouter = require("./courseRouter.js");
const studentRouter = require("./studentRouter.js");
const examRouter = require("./examRouter.js");

const router = express.Router();

router.use("/course", courseRouter);
router.use("/student", studentRouter);
router.use("/exam", examRouter);

module.exports = router;