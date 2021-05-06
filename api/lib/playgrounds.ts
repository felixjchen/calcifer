import { production, domain } from "../config";
import { exec } from "./util";

// Most playgrounds are simple and can be started in one line
const start_simple_playground = async (id: string, type: string) => {
  try {
    let command: string;
    if (production) {
      command = `docker run --runtime=sysbox-runc -d --network calcifer_default --name=${id} --network-alias=${id} -e VIRTUAL_HOST=${id}.${domain} felixchen1998/calcifer-playground:${type}`;
    } else {
      // Development is slightly different, we use virtual pathes
      command = `docker run --privileged -d --network calcifer_default --name=${id} --network-alias=${id} --env VIRTUAL_PATH=/${id} felixchen1998/calcifer-playground:${type}`;
    }
    await exec(command);
  } catch (err) {
    throw new Error(err);
  }
};

// Start a kubectl container, k8 master and three k8 workers
const start_kind_playground = async (id: string) => {
  try {
    // Kubectl container
    let command = `docker run --runtime=sysbox-runc -d --network calcifer_default --name=${id} --network-alias=${id} -e VIRTUAL_HOST=${id}.${domain} felixchen1998/calcifer-playground:kind`;
    console.log("creating kubectl container");
    await exec(command);
    // K8s cluster
    command = `lib/kindbox create --num-workers=3 --net=calcifer_default ${id}-cluster`;
    console.log("creating KIND cluster");
    await exec(command);

    // Copy config over to KIND container
    command = `docker cp ~/.kube/${id}-cluster-config ${id}:"/root/.kube/${id}-cluster-config"`;
    await exec(command);
    console.log("copied kubeconfig to kubectl container");
    command = `docker exec ${id} /bin/sh -c 'echo "export KUBECONFIG=/root/.kube/${id}-cluster-config" >> /root/.profile'`;
    await exec(command);
    console.log("set kubeconfig");

    console.log(`created kind for ${id}`);
  } catch (err) {
    throw new Error(err);
  }
};

// Start a playground, with id and type
export const start_playground = async (
  id: string,
  type: string
): Promise<void> => {
  console.log(`starting ${type} playground for ${id}`);
  try {
    if (type === "kind") {
      // Kind clusers require special setup
      await start_kind_playground(id);
    } else {
      // Single container setups
      await start_simple_playground(id, type);
    }
  } catch (err) {
    throw new Error(err);
  }
};

const kill_kind_playground = async (id: string) => {
  try {
    // Kill Kubectl container
    let command = `docker kill ${id}`;
    await exec(command);
    // Kill cluster
    command = `lib/kindbox destroy ${id}-cluster`;
    await exec(command);
  } catch (err) {
    throw new Error(err);
  }
};
const kill_simple_playground = async (id) => {
  try {
    await exec(`docker kill ${id}`);
  } catch (err) {
    throw new Error(err);
  }
};

export const kill_playground = async (id, type) => {
  console.log(`Killing ${id} of type ${id}`);
  try {
    if (type === "kind") {
      kill_kind_playground(id);
    } else {
      kill_simple_playground(id);
    }
  } catch (err) {
    throw new Error(err);
  }
};
