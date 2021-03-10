import SSH2Promise from "ssh2-promise";
import mySFTP from "./SFTP";

// Socket listens to one client
// Broadcast across namespace
export const adapter = async (socket, namespace) => {
  let { host, username, password } = socket.handshake.query;
  let config = { host, username, password };
  console.log({ config });
  
  let ssh = new SSH2Promise(config);
  let shell = await ssh.shell();
  let sftp = new mySFTP(ssh);

  // Initial List
  let list = await sftp.readdir_r("/root");
  namespace.emit("list", list);

  // Shell Events
  socket.on("data", async (data) => {
    shell.write(data);
    // If shell modifies FS... the frontend should know!
    if (data === "\r") {
      let list = await sftp.readdir_r("/root");
      namespace.emit("list", list);
    }
  });
  shell.on("data", (data) => {
    namespace.emit("data", data.toString("binary"));
  });

  // File System Events
  // https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
  socket.on("getFile", async (file) => {
    const content = await sftp.readfile(file.path);
    socket.emit("sendFile", { node: file, content });
  });
  socket.on("writeFile", async (path, content) => {
    await sftp.writefile(path, content);
  });
  socket.on("deleteFile", async (path) => {
    await sftp.unlink(path);
  });
  socket.on("renameFile", async (src, dest) =>{
    await sftp.rename(src, dest)
  })
  socket.on("makeDir", async (path) => {
    await sftp.mkdir(path);
  });

  // Close events
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
