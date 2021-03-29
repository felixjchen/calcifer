import * as express from "express";

import { get_playground_id } from "../lib/util";
import { kill_playground, start_playground } from "../lib/playgrounds";
import { stale_buffer } from "../config";
import { Error } from "mongoose";

export const get_router = (models) => {
  const router = express.Router();
  const { Playgrounds } = models;

  router.get("/playgrounds", async (req, res) => {
    try {
      let playgrounds = await Playgrounds.find({}).limit(100);
      return res.json(playgrounds);
    } catch (e) {
      return res.status(500).json({ failure: e.message });
    }
  });

  router.post("/playgrounds", async (req, res) => {
    let _id;
    const { type } = req.body;
    if (req.body === undefined || type === undefined) {
      return res.status(400).json({ failure: "req.body.type must be defined" });
    }

    // Create document in MongoDB, we let mongoose check if its valid type for us :)
    try {
      _id = get_playground_id();
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
    try {
      let { _id } = req.params;
      let result = await Playgrounds.query({ _id });
      return res.send({ result });
    } catch (e) {
      return res.status(500).json({ failure: e.message });
    }
  });

  // Bump
  router.put("/playgrounds/:_id/bump", async (req, res) => {
    try {
      let { _id } = req.params;
      let r = await Playgrounds.updateOne({ _id }, { updatedAt: Date.now() });
      let success = r.nModified === 1;
      return res.send({ success });
    } catch (e) {
      return res.status(500).json({ failure: e.message });
    }
  });

  // Delete all stale playgrounds,
  // Stale = older then current date - stale buffer
  router.delete("/playgrounds", async (req, res) => {
    try {
      let now_date = new Date();
      let stale_date = new Date(now_date);
      stale_date.setDate(now_date.getDate() - stale_buffer);

      // Get all container ids
      let stale = await Playgrounds.find({ updatedAt: { $lt: stale_date } });
      let success = true;
      stale.forEach(async ({ _id, type }) => {
        // Kill playground and remove from
        await kill_playground(_id, type);
        let remove = await Playgrounds.remove({ _id });
        console.log(`Killed ${_id}`);
        success = success && remove.n === 1;
      });

      res.send({ success });
    } catch (e) {
      return res.status(500).json({ failure: e.message });
    }
  });

  return router;
};
