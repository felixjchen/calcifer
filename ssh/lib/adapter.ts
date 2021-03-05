import SSH2Promise from "ssh2-promise";
import mySFTP from "./SFTP";

// Socket listens to one client
// Broadcast across namespace
export const adapter = async (socket, namespace) => {
  let { host, username, password } = socket.handshake.query;
  let config = { host, username, password };
  let ssh = new SSH2Promise(config);
  // SFTP
  let sftp = new mySFTP(ssh);
  let list = await sftp.readdir_r("/root");
  namespace.emit("list", JSON.stringify(list, undefined, 2));

  // Shell
  let shell = await ssh.shell();
  socket.on("data", async (data) => {
    shell.write(data);
    // If shell modifies FS... the frontend should know!
    if (data === "\r") {
      let list = await sftp.readdir_r("/root");
      namespace.emit("list", JSON.stringify(list, undefined, 2));
    }
  });
  shell.on("data", (data) => {
    namespace.emit("data", data.toString("binary"));
  });
  socket.on("disconnect", async () => {
    await ssh.close();
  });
  shell.on("close", async () => {
    await ssh.close();
  });
  shell.on("error", async () => {
    await ssh.close();
  });

  // await sftp.writefile("/root/testing_read_write.txt", "yesssirrr2yesssir");
  // console.log(await sftp.readfile("/root/testing_read_write.txt"));
};
