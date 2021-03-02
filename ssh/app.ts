import * as socketio from "socket.io";
import * as express from "express";

const app = express();
app.set("port", process.env.PORT || 8000);

let http = require("http").Server(app);
let io = require("socket.io")(http, { cors: { origin: "*" } });
let SSHClient = require("ssh2").Client;

io.on("connection", function (socket) {
  var conn = new SSHClient();
  conn
    .on("ready", function () {
      socket.emit("data", "\r\n*** SSH CONNECTION ESTABLISHED ***\r\n");
      conn.shell(function (err, stream) {
        if (err)
          return socket.emit(
            "data",
            "\r\n*** SSH SHELL ERROR: " + err.message + " ***\r\n"
          );
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

const server = http.listen(8000, function () {
  console.log("listening on *:8000");
});
