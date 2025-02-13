const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const mongoose = require("mongoose");
const socket = require("socket.io");
const path = require("path");

const socketServer = require("./sockets/socketHandler.js");
const router = require("./router.js");
const cronJob = require("./cronJob.js");

const app = express();

// CONFIG
dotenv.config();
app.use(cors());
app.use(express.json());
app.use(morgan("short"));
app.use("/public", express.static(path.join(__dirname, "../public")));


// ROUTES
app.use("/", router);

console.log(process.env.MONGO_URL);

mongoose
   .connect(process.env.MONGO_URL)
   .then(() => {
      const PORT = process.env.PORT || 8080;
      const server = app.listen(PORT, () => {
         console.log(`Running: http://localhost:${PORT}`);
      });

      cronJob();

      const io = socket(server, {
         cors: {
            origin: "*",
            credentials: true,
         },
      });
      socketServer(io);
   })
   .catch((err) => {
      console.log(err);
   });
