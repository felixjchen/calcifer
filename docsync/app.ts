import express from "express";
import * as body_parser from "body-parser";
import http from "http";
import ShareDB from "sharedb";
import WebSocket from "ws";
import WebSocketJSONStream from "@teamwork/websocket-json-stream";

import { load_routers } from "./lib/util";
import { PORT, production } from "./config";

// Servers
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const sharedb = new ShareDB();

// Cors for development
if (!production) {
  const cors = require("cors");
  app.use(cors());
}

app.use(body_parser.json());

const init = async () => {
  wss.on("connection", (ws, req) => {
    const stream = new WebSocketJSONStream(ws);
    sharedb.listen(stream);
  });

  load_routers(app, sharedb);

  server.listen(PORT, function () {
    console.log(`docsync server at 0.0.0.0:${PORT}`);
  });
};
init();
