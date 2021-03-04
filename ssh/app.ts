import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import { adapter } from "./lib/adapter";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 8000;

io.on("connection", (socket) => {
  adapter(socket);
});

server.listen(PORT, function () {
  console.log(`ssh server at 0.0.0.0:${PORT}`);
});
