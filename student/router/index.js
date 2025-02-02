const express = require("express");

const courseRouter = require("./courseRouter.js");
const examRouter = require("./examRouter.js");

const router = express.Router();

router.use("/course", courseRouter);
router.use("/exam", examRouter);

module.exports = router;