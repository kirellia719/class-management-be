const express = require("express");

const authRouter = require("./authRouter.js");

const router = express.Router();

router.use("/auth", authRouter);

module.exports = router;
