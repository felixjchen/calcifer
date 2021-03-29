import { production } from "../config";
// https://nodejs.org/api/child_process.html#child_process_child_process_exec_command_options_callback
import { exec } from "./util";

// Most playgrounds are simple and can be started in one line
const get_playground_command = (id: string, type: string): string => {
  if (production) {
    return `docker run --runtime=sysbox-runc -d --network project-calcifer_default --name=${id} --network-alias=${id} -e LETSENCRYPT_HOST=${id}.markl.tk -e VIRTUAL_HOST=${id}.markl.tk felixchen1998/calcifer-playground:${type}`;
  } else {
    return `docker run --privileged -d --network project-calcifer_default --name=${id} --network-alias=${id} --env VIRTUAL_PATH=/${id} felixchen1998/calcifer-playground:${type}`;
  }
};

// Start a kubectl container, k8 master and three k8 worders
const start_kind_playground = async (id: string) => {
  try {
    // Kubectl container
    let command = `docker run --runtime=sysbox-runc -d --network project-calcifer_default --name=${id} --network-alias=${id} -e LETSENCRYPT_HOST=${id}.markl.tk -e VIRTUAL_HOST=${id}.markl.tk felixchen1998/calcifer-playground:kind`;
    console.log("Creating kubectl container");
    await exec(command);
    // K8s cluster
    command = `lib/kindbox create --num-workers=3 --net=project-calcifer_default ${id}-cluster`;
    console.log("Creating KIND cluster");
    await exec(command);
    // Copy config over to KIND container
    command = `docker cp ~/.kube/${id}-cluster-config ${id}:"/root/.kube/${id}-cluster-config"`;
    console.log("Copying kubeconfig to kubectl container");
    await exec(command);
    console.log("Seting kubeconfig");
    command = `docker exec ${id} /bin/sh -c 'echo "export KUBECONFIG=/root/.kube/${id}-cluster-config" >> /root/.profile'`;
    await exec(command);

    console.log(`Created kind for ${id}`);
  } catch (e) {
    console.log(e);
  }
};

// Start a playground, with id and type
export const start_playground = async (
  id: string,
  type: string
): Promise<void> => {
  console.log(`Starting ${type} playground for ${id}`);
  if (type === "kind") {
    // Kind clusers require special setup
    await start_kind_playground(id);
  } else {
    // Single container setups
    let command = get_playground_command(id, type);
    let { stdout } = await exec(command);
    stdout = stdout.trim();
    console.log(
      `Created container with ID ${stdout}, with playground ID ${id}`
    );
  }
};

const kill_kind_playground = async (id: string) => {
  // Kill Kubectl container
  let command = `docker kill ${id}`;
  await exec(command);
  // Kill cluster
  command = `lib/kindbox destroy ${id}-cluster`;
  await exec(command);
};
const kill_container = async (id) => {
  await exec(`docker kill ${id}`);
};

export const kill_playground = async (id, type) => {
  if (type === "kind") {
    kill_kind_playground(id);
  } else {
    kill_container(id);
  }
};
