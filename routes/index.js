const express = require("express");

const authRouter = require("./authRouter.js");
const courseRouter = require("./courseRouter.js");
const studentRouter = require("./studentRouter.js");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/course", courseRouter);
router.use("/student", studentRouter);

module.exports = router;
