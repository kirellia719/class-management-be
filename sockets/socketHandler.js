
module.exports = (io) => {
   io.on("connection", (socket) => {
      console.log(socket.id + " - connected");

      socket.on("disconnect", () => {
         console.log("Client disconnected");
      });
   });
};
