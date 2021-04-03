import express from "express";
import http from "http";
import { Server } from "socket.io";
import { adapter } from "./lib/adapter";
import { History } from "./lib/history";
import { socketio_options, socketio_namespace_regex, PORT } from "./config";

const app = express();
const server = http.createServer(app);
const io = new Server(server, socketio_options);

// Redis shell history for subsequent clients
const history = new History();

// Playgrounds use "adjective-animal" ids in prod, but in dev we use as a normal ssh client
const namespaces = io.of(socketio_namespace_regex);
namespaces.on("connection", (socket) => {
  adapter(socket, history);
});

server.listen(PORT, function () {
  console.log(`ssh server at 0.0.0.0:${PORT}`);
});
