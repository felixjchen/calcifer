import express from "express";
import http from "http";
import ShareDB from "sharedb";
import ws from "ws";
import WebSocketJSONStream from "@teamwork/websocket-json-stream";
import QueryString from "query-string";

import { adapter } from "./lib/adapter";

const app = express();
const server = http.createServer(app);
const wss = new ws.Server({ server });
const PORT = process.env.PORT || 8000;

const share = new ShareDB();

wss.on("connection", function (ws, req) {
  // Leading slash annoying
  req.url = req.url.replace("/", "");
  const config = QueryString.parse(req.url);

  const stream = new WebSocketJSONStream(ws);
  share.listen(stream);
});

server.listen(PORT, function () {
  console.log(`ssh server at 0.0.0.0:${PORT}`);
});
