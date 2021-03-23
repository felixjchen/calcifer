import { production } from "../config";

export const get_container_start_command = (id) => {
  if (production) {
    return `docker run --runtime=sysbox-runc -d --network project-calcifer_default --name=${id} --network-alias=${id} --env VIRTUAL_PATH=/${id}/ felixchen1998/calcifer-playground:latest`;
  } else {
    return `docker run --privileged -d --network project-calcifer_default --name=${id} --network-alias=${id} --env VIRTUAL_PATH=/${id}/ felixchen1998/calcifer-playground:latest`;
  }
};

export const load_routers = (app) => {};
