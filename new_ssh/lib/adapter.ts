import SSH2Promise from "ssh2-promise";
import mySFTP from "./SFTP";

// Returns a function that lists files across namespace
const getLister = (sftp, socket) => async () => {
  let list = await sftp.readdir_r("/root");
  socket.emit("list", list);
};

// Socket listens to one client
// Broadcast across namespace, namespace per SSH target host
export const adapter = async (ws, config) => {
  console.log(config);
  let ssh = new SSH2Promise(config);
  let shell: any;

  try {
    shell = await ssh.shell();
  } catch {
    // socket.emit("ssh_error_connecting");
    return;
  }

  let sftp = new mySFTP(ssh);
  let list = getLister(sftp, ws);

  console.log(await sftp.readdir("/"));
};
