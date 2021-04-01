import express from "express";
import * as body_parser from "body-parser";
import http from "http";
import ShareDB from "sharedb";
import WebSocket from "ws";
import WebSocketJSONStream from "@teamwork/websocket-json-stream";

import { set_doc_content } from "./lib/util";

const PORT = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const sharedb = new ShareDB();

const cors = require("cors");
app.use(cors());

wss.on("connection", (ws, req) => {
  const stream = new WebSocketJSONStream(ws);
  sharedb.listen(stream);
});

app.use(body_parser.json());
app.post("/doc", async (req, res) => {
  let { collection, documentID, content } = req.body;
  if (collection === undefined || documentID === undefined) {
    return res.status(400).json({
      failure:
        "req.body.collection, req.body.documentID and req.body.body must be defined",
    });
  }

  const connection = sharedb.connect();
  const doc = connection.get(collection, documentID);
  try {
    await set_doc_content(doc, content);
  } catch (e) {
    console.error(e);
    return res.status(500).json({
      failure: "server error",
    });
  }

  return res.json({ success: "synced doc" });
});

server.listen(PORT, function () {
  console.log(`docsync server at 0.0.0.0:${PORT}`);
});
