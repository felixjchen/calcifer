import * as express from "express";
import { set_doc_content } from "../lib/docs";

export const get_router = (sharedb) => {
  const router = express.Router();

  // Start a document, PUT because this is idempotent
  router.put("/doc", async (req, res) => {
    let { collection, documentID, content } = req.body;
    if (collection === undefined || documentID === undefined) {
      return res.status(400).json({
        failure:
          "req.body.collection, req.body.documentID and req.body.content must be defined",
      });
    }

    try {
      let response_message: string;
      const connection = sharedb.connect();
      const doc = connection.get(collection, documentID);
      response_message = await set_doc_content(doc, content);
      return res.json({ success: response_message });
    } catch (err) {
      console.error(err);
      return res.status(500).json({
        failure: err,
      });
    }
  });

  return router;
};
