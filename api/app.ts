import * as express from "express";

// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
import * as child_process from "child_process";
import * as util from "util";
const exec = util.promisify(child_process.exec);

import { db_init } from "./lib/db";

const port = 8080;
const app = express();
let Playgrounds;

app.get("/api/", (req, res) => {
  res.send("Hello from playgrounds");
});

app.get("/api/playgrounds", async (req, res) => {
  let playgrounds = await Playgrounds.find({});

  res.json(playgrounds);
});

app.post("/api/playgrounds", async (req, res) => {
  // Create document in MongoDB
  let { _id } = await Playgrounds.create({});

  // Start a DIND
  let { stdout, stderr } = await exec(
    `docker run --privileged -d --network project-calcifer_calcifer --env VIRTUAL_PATH=/playgrounds/${_id} felixchen1998/calcifer-playground:latest`
  );

  // trim newline off..
  stdout = stdout.trim();

  console.log(`Created container with ID ${stdout}, with playground ID ${_id}`);
  res.json({ stdout, stderr, _id });
});

const init = async () => {
  ({ Playgrounds } = await db_init());

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

init();
