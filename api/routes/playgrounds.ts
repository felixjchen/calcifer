import * as express from "express";

import { get_playground_id } from "../lib/util";
import { start_playground, kill_container } from "../lib/playgrounds";
import { stale_buffer } from "../config";

export const get_router = (models) => {
  const router = express.Router();
  const { Playgrounds } = models;

  router.get("/playgrounds", async (req, res) => {
    let playgrounds = await Playgrounds.find({}).limit(100);
    res.json(playgrounds);
  });

  router.post("/playgrounds", async (req, res) => {
    // if (req.body === undefined || req.body.type === undefined) {
    //   return res
    //     .sendStatus(400)
    //     .json({ failure: "req.body.type must be defined" });
    // }

    // Create document in MongoDB
    let _id = get_playground_id();
    await start_playground(_id, req.body.type);
    await Playgrounds.create({ _id });
    res.json({ _id });
  });

  router.get("/playgrounds/:_id", async (req, res) => {
    let { _id } = req.params;
    let result = await Playgrounds.query({ _id });
    res.send({ result });
  });

  // Bump
  router.put("/playgrounds/:_id/bump", async (req, res) => {
    let { _id } = req.params;
    let r = await Playgrounds.updateOne({ _id }, { updatedAt: Date.now() });
    let success = r.nModified === 1;
    res.send({ success });
  });

  // Delete all playgrounds, older then current date - stale buffer
  router.delete("/playgrounds", async (req, res) => {
    let now_date = new Date();
    let stale_date = new Date(now_date);
    stale_date.setDate(now_date.getDate() - stale_buffer);

    // Get all container ids
    let stale = await Playgrounds.find({ updatedAt: { $lt: stale_date } });
    let success = true;
    stale.forEach(async ({ _id }) => {
      // Kill playground and remove from
      let stderr = await kill_container(_id);
      let remove = await Playgrounds.remove({ _id });
      console.log(`Killed ${_id}`);
      success = remove.n === 1 && stderr === "";
    });

    res.send({ success });
  });

  return router;
};
