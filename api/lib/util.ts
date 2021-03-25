import {
  uniqueNamesGenerator,
  adjectives,
  animals,
  names,
} from "unique-names-generator";
import * as path from "path";
import { promises as fs } from "fs";

const router_directory = path.join(__dirname, "..", "routes");

export const get_playground_id = (): string => {
  const name = uniqueNamesGenerator({
    dictionaries: [names, adjectives, animals],
    separator: "-",
    style: "lowerCase",
  });
  return name;
};

export const load_routers = async (app, models) => {
  const router_files = await fs.readdir(router_directory);
  router_files.forEach((router_file) => {
    let { get_router } = require(path.join(router_directory, router_file));
    let router = get_router(models);

    app.use("/", router);
  });

  console.log("Routers loaded");
};
