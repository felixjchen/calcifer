import { production } from "../config";
import * as path from "path";
import { promises as fs } from "fs";

const router_directory = path.join(__dirname, "..", "routes");

export const get_container_start_command = (id) => {
  if (production) {
    return `docker run --runtime=sysbox-runc -d --network project-calcifer_default --name=${id} --network-alias=${id} -e LETSENCRYPT_HOST=${id}.markl.tk -e VIRTUAL_HOST=${id}.markl.tk felixchen1998/calcifer-playground:latest`;
  } else {
    return `docker run --privileged -d --network project-calcifer_default --name=${id} --network-alias=${id} --env VIRTUAL_PATH=/${id} felixchen1998/calcifer-playground:latest`;
  }
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
