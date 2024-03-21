'use strict';
const { default: strapiFactory } = require("@strapi/strapi");
const { Server } = require("socket.io");

module.exports = {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/*{ strapi }*/) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap() {
    const io = new Server(strapi.server.httpServer, {
      cors: {
        origin: "http://localhost:3000"
      }
    });

    io.on('connection', (socket) => {
      socket.on("join", (room) => {
        socket.join(room);
      });

      console.log('a user connected');
      socket.on("sendMessage", (data) => {
        console.log("sendMessage", data);
        strapi.db.query("api::message.message").create({ data: { user: data.user, message: data.message, room: data.room }})

        io.to(data.room).emit("getMessage", data);
      });
    });
  },
};
