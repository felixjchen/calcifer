import * as express from "express";

// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
import * as child_process from "child_process";
import * as util from "util";

import { get_container_start_command } from "./lib/util";
import { db_init } from "./lib/db";
import { stale_buffer } from "./config";

const exec = util.promisify(child_process.exec);
const port = 8080;
const app = express();
let Playgrounds;

app.get("/playgrounds", async (req, res) => {
  let playgrounds = await Playgrounds.find({});
  res.json(playgrounds);
});

app.post("/playgrounds", async (req, res) => {
  // Create document in MongoDB
  let { _id } = await Playgrounds.create({});
  // Start a DIND
  let { stdout, stderr } = await exec(get_container_start_command(_id));
  // trim newline off..
  stdout = stdout.trim();
  console.log(`Created container with ID ${stdout}, with playground ID ${_id}`);
  res.json({ stdout, stderr, _id });
});

// Bump
app.get("/playgrounds/:_id", async (req, res) => {
  let { _id } = req.params;
  let result = await Playgrounds.query({ _id });
  res.send({ result });
});

app.put("/playgrounds/:_id/bump", async (req, res) => {
  let { _id } = req.params;
  let r = await Playgrounds.updateOne({ _id }, { updatedAt: Date.now() });
  let success = r.nModified === 1;
  res.send({ success });
});

// Delete all playgrounds, older then current date - stale buffer
app.delete("/playgrounds", async (req, res) => {
  let now_date = new Date();
  let stale_date = new Date(now_date);
  stale_date.setDate(now_date.getDate() - stale_buffer);

  // Get all container ids
  let stale = await Playgrounds.find({ updatedAt: { $lt: stale_date } });
  let success = true;
  stale.forEach(async ({ _id }) => {
    // Kill playground and remove from
    let { stdout, stderr } = await exec(`docker kill ${_id}`);
    let remove = await Playgrounds.remove({ _id });
    console.log(`Killed ${_id}`);
    success == success && remove.n === 1 && stderr === "";
  });

  res.send({ success });
});

const init = async () => {
  ({ Playgrounds } = await db_init());
  // Assume no playgrounds
  await Playgrounds.remove({});

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

init();
