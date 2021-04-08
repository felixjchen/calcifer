import http from "http";
import { Server } from "socket.io";
import { History } from "./lib/history";
import { socketio_options, socketio_namespace_regex, PORT } from "./config";

import { connectionHandler } from "./handlers/connection";

const server = http.createServer();
const io = new Server(server, socketio_options);

// Redis shell history for subsequent clients
const shells = {};
const shell_history = new History();

const namespaces = io.of(socketio_namespace_regex);
namespaces.on("connection", (socket) => {
  connectionHandler(socket, shells, shell_history);
});

server.listen(PORT, function () {
  console.log(`ssh server at 0.0.0.0:${PORT}`);
});
