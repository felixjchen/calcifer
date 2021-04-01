import express from "express";
import * as body_parser from "body-parser";
import http from "http";
import ShareDB from "sharedb";
import WebSocket from "ws";
import QueryString from "query-string";
import WebSocketJSONStream from "@teamwork/websocket-json-stream";

const PORT = process.env.PORT || 9000;

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const sharedb = new ShareDB();

const cors = require("cors");
app.use(cors());

wss.on("connection", (ws, req) => {
  console.log(req);
  // Leading slash annoying
  // req.url = req.url.replace("/", "");
  // const config = QueryString.parse(req.url);

  const stream = new WebSocketJSONStream(ws);
  sharedb.listen(stream);
});

app.use(body_parser.json());
app.post("/doc", (req, res) => {
  let { collection, documentID, content } = req.body;
  if (collection === undefined || documentID === undefined) {
    return res.status(400).json({
      failure:
        "req.body.collection, req.body.documentID and req.body.body must be defined",
    });
  }

  try {
    const connection = sharedb.connect();
    const doc = connection.get(collection, documentID);
    doc.fetch(() => {
      if (
        doc.data === undefined ||
        doc.data.content === undefined ||
        doc.data.content !== content
      ) {
        doc.create({ content });
      }
    });

    return res.json({ success: "document created" });
  } catch (e) {
    return res.status(500).json({
      failure: "server error",
    });
  }
});

server.listen(PORT, function () {
  console.log(`docsync server at 0.0.0.0:${PORT}`);
});
