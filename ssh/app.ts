import * as express from "express";
import * as http from "http";
import { Server } from "socket.io";
import * as ssh2 from "ssh2";

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });
const PORT = process.env.PORT || 8000;

const SSHClient = ssh2.Client;

io.on("connection", function (socket) {
  let conn = new SSHClient();
  conn
    .on("ready", function () {
      socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
      conn.shell(function (err, stream) {
        if (err) {
          return socket.emit(
            "data",
            "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
          );
        }
        socket.on("data", function (data) {
          stream.write(data);
        });
        stream
          .on("data", function (d) {
            socket.emit("data", d.toString("binary"));
          })
          .on("close", function () {
            conn.end();
          });
      });
    })
    .on("close", function () {
      socket.emit("data", "\r\n*** SSH CONNECTION CLOSED ***\r\n");
    })
    .on("error", function (err) {
      socket.emit(
        "data",
        "\r\n*** SSH CONNECTION ERROR: " + err.message + " ***\r\n"
      );
    })
    .connect({
      host: "172.26.0.4",
      port: 22,
      username: "root",
      password: "abc123",
    });
});

server.listen(PORT, function () {
  console.log(`ssh server at 0.0.0.0:${PORT}`);
});
