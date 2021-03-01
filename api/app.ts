import * as express from "express";
import { v4 as uuidv4 } from "uuid";

// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
import * as child_process from "child_process";
import * as util from "util";
const exec = util.promisify(child_process.exec);

import * as console from "./lib/logging";
import { db_init } from "./lib/db";

const port = 8080;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from playgrounds");
});

app.get("/playgrounds", async (req, res) => {
  let { stdout, stderr } = await exec("docker container ls");
  let playgrounds = stdout.split("\n");
  // Get rid of empty entries
  playgrounds = playgrounds.filter((i) => i.length > 0);
  res.json(playgrounds);
});

app.post("/playgrounds", async (req, res) => {
  let _id = uuidv4();

  let { stdout, stderr } = await exec(
    `docker run --privileged  -d  --network calcifer_default --network-alias playground --env VIRTUAL_PATH=/playgrounds/${_id} felixchen1998/calcifer-playground:latest`
  );

  console.success(`Created container ${_id}`);
  res.json({ stdout, stderr, _id });
});

const init = async () => {
  await db_init();

  app.listen(port, "0.0.0.0", () => {
    console.success(`Server listening at http://localhost:${port}`);
  });
};

init();
