import * as path from "path";
import { promises as fs } from "fs";

// Load routers
const router_directory = path.join(__dirname, "..", "routes");
export const load_routers = async (app, sharedb) => {
  const router_files = await fs.readdir(router_directory);
  router_files.forEach((router_file) => {
    let { get_router } = require(path.join(router_directory, router_file));
    let router = get_router(sharedb);

    app.use("/", router);
  });

  console.log("routers loaded");
};
