import SSH2Promise = require("ssh2-promise");

// list recursive
let readdir_r = async (sftp, path) => {
  let list = await sftp.readdir(path);
  // Fill sub directories
  for (let i in list) {
    let file = list[i];
    // If this is a directory
    if (file.longname[0] === "d") {
      file.children = await readdir_r(sftp, `${path}/${file.filename}`);
    }
  }
  return list;
};

// Socket listens to one client
// Broadcast across namespace
export const adapter = async (socket, namespace) => {
  let { host, username, password } = socket.handshake.query;
  let config = { host, username, password };
  let ssh = new SSH2Promise(config);

  // SFTP
  let sftp = ssh.sftp();
  let list = await readdir_r(sftp, "/root");
  namespace.emit("list", JSON.stringify(list, undefined, 2));

  // Shell
  let shell = await ssh.shell();
  socket.on("data", async (data) => {
    shell.write(data);
    console.log({ data });
    // If shell modifies FS... the frontend should know!
    if (data === "\r") {
      let list = await readdir_r(sftp, "/root");
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
};
