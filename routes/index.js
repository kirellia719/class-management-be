const express = require("express");

const authRouter = require("./authRouter.js");
const courseRouter = require("./courseRouter.js");

const router = express.Router();

router.use("/auth", authRouter);
router.use("/course", courseRouter);

module.exports = router;
