import * as express from "express";

import { get_playground_id } from "../lib/util";
import { kill_playground, start_playground } from "../lib/playgrounds";
import { stale_buffer } from "../config";
import { Error } from "mongoose";

export const get_router = (models) => {
  const router = express.Router();
  const { Playgrounds } = models;

  router.post("/playgrounds", async (req, res) => {
    const { type } = req.body;
    if (type === undefined) {
      return res.status(400).json({ failure: "req.body.type must be defined" });
    }

    try {
      // Generate name
      let _id = get_playground_id();
      // Start client containers
      await start_playground(_id, type);
      // Create document in MongoDB, we let mongoose check if its valid type for us :)
      await Playgrounds.create({ _id, type });
      return res.json({ _id });
    } catch (err) {
      if (err instanceof Error.ValidationError) {
        return res.status(400).json({ failure: err.message });
      } else {
        return res.status(500).json({ failure: err.message });
      }
    }
  });

  // Middleware to check if playground with _id exists, if it does cache it in request
  const playground_id_check = async (req, res, next) => {
    try {
      let { _id } = req.params;
      let result = await Playgrounds.findOne({ _id });
      if (result === null) {
        // no playground with _id
        return res.status(404).json({ failure: `No such playground ${_id}` });
      } else {
        // cache
        req.playground = result;
        next();
      }
    } catch (err) {
      return res.status(500).json({ failure: err.message });
    }
  };

  router.get("/playgrounds/:_id", playground_id_check, async (req, res) => {
    let { type, createdAt, updatedAt } = req.playground;
    return res.send({ type, createdAt, updatedAt });
  });

  // Bump
  router.put(
    "/playgrounds/:_id/bump",
    playground_id_check,
    async (req, res) => {
      try {
        let { _id } = req.params;
        let result = await Playgrounds.updateOne(
          { _id },
          { updatedAt: Date.now() }
        );
        if (result.nModified === 0) {
          // Our middleware guarentees this playground exists... so this must be a server error
          return res.status(500).json({ failure: `Something went wrong` });
        } else {
          return res.send({ success: "true" });
        }
      } catch (e) {
        return res.status(500).json({ failure: e.message });
      }
    }
  );

  // Delete a playground
  router.delete("/playgrounds/:_id", playground_id_check, async (req, res) => {
    try {
      let { _id, type } = req.playground;

      // Docker kill
      await kill_playground(_id, type);
      // Remove from DB
      let result = await Playgrounds.remove({ _id });

      if (result.n === 0) {
        // Our middleware guarentees this playground exists... so this must be a server error
        return res.status(500).json({ failure: `Something went wrong` });
      } else {
        return res.send({ success: "true" });
      }
    } catch (err) {
      return res.status(500).json({ failure: err.message });
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
      res.send({ success, nDeleted: stale.length });
    } catch (err) {
      return res.status(500).json({ failure: err.message });
    }
  });

  return router;
};
