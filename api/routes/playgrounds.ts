import * as express from "express";

import { get_playground_id } from "../lib/util";
import { kill_container, start_playground } from "../lib/playgrounds";
import { stale_buffer } from "../config";
import { Error } from "mongoose";

export const get_router = (models) => {
  const router = express.Router();
  const { Playgrounds } = models;

  router.get("/playgrounds", async (req, res) => {
    let playgrounds = await Playgrounds.find({}).limit(100);
    res.json(playgrounds);
  });

  router.post("/playgrounds", async (req, res) => {
    const { type } = req.body;
    if (req.body === undefined || type === undefined) {
      return res.status(400).json({ failure: "req.body.type must be defined" });
    }

    const _id = get_playground_id();

    // Create document in MongoDB, we let mongoose check if its valid type for us :)
    try {
      await Playgrounds.create({ _id, type });
    } catch (e) {
      if (e instanceof Error.ValidationError) {
        return res.status(400).json({ failure: e.message });
      } else {
        return res.status(500).json({ failure: e.message });
      }
    }

    try {
      await start_playground(_id, type);
    } catch (e) {
      return res.status(500).json({ failure: e.message });
    }
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
