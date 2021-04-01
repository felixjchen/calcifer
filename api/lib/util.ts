import {
  uniqueNamesGenerator,
  adjectives,
  animals,
} from "unique-names-generator";
import * as path from "path";
import { promises as fs } from "fs";

// Promisfy execing commands
import * as child_process from "child_process";
import * as util from "util";
export const exec = util.promisify(child_process.exec);

// Pull a playgrounds
export const pull_playground_images = async () => {
  let { stdout } = await exec(
    "docker pull -a felixchen1998/calcifer-playground"
  );

  console.log(stdout);
};

// Generate a random new playground id
export const get_playground_id = (): string => {
  const name = uniqueNamesGenerator({
    dictionaries: [adjectives, animals],
    separator: "-",
    style: "lowerCase",
  });
  return name;
};

// Load routers
const router_directory = path.join(__dirname, "..", "routes");
export const load_routers = async (app, models) => {
  const router_files = await fs.readdir(router_directory);
  router_files.forEach((router_file) => {
    let { get_router } = require(path.join(router_directory, router_file));
    let router = get_router(models);

    app.use("/", router);
  });

  console.log("Routers loaded");
};
