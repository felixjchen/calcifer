import express from "express";
import http from "http";
import { Server } from "socket.io";
import { adapter } from "./lib/adapter";

const PORT = process.env.PORT || 8000;

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

// Playgrounds use hexadecimal IDs
// const namespaces = io.of(/[a-zA-Z-_]+$/);
const namespaces = io.of(/.+$/);
namespaces.on("connection", (socket) => {
  adapter(socket);
});

server.listen(PORT, function () {
  console.log(`ssh server at 0.0.0.0:${PORT}`);
});
