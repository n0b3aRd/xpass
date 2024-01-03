import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import dotenv from "dotenv";
import router from "./app/routes/main.js";
import { instrument } from "@socket.io/admin-ui";
import { createAdapter } from "@socket.io/redis-adapter";
import { pubClient, subClient } from "./app/database/redis_db.js";
import logger from "./app/utils/logger.js";

logger.debug("server starting...");

dotenv.config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", router);

const httpServer = createServer(app);
const lynked_ws = new Server(httpServer, {
  cors: {
    origin: "*",
    credentials: false, // todo: set cors settings
  },
});

//redis adapter
Promise.all([pubClient.connect(), subClient.connect()]).then(() => {
  lynked_ws.adapter(createAdapter(pubClient, subClient));
});


//lynked ws server
lynked_ws.on("connection", (socket) => {
  logger.info(socket.id + " connected");

  socket.on("join-room", (room) => {
    socket.join(room);
    logger.info(socket.id + " joined to " + room + " room");
  });

  socket.on("trigger-event", (event, data) => {
    socket.broadcast.emit(event, data);
    logger.info(event + " triggerd");
  });

  socket.on("disconnect", () => {
    logger.info(socket.id, +" disconnected");
  });
});

//admin ui
instrument(lynked_ws, {
  auth: {
    type: "basic",
    username: process.env.ADMIN_UI_USERNAME,
    password: process.env.ADMIN_UI_PASSWORD,
  },
  mode: "production",
});

httpServer.listen(process.env.PORT, process.env.APP_URL, () => {
  console.log(
    `Server running at http://${process.env.APP_URL}:${process.env.PORT}/`
  );
});

export { lynked_ws };
