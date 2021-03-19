import SSH2Promise from "ssh2-promise";
import mySFTP from "./SFTP";

// Returns a function that lists files across namespace
const getLister = (sftp, namespace) => async () => {
  let list = await sftp.readdir_r("/root");
  namespace.emit("list", list);
};

// Socket listens to one client
// Broadcast across namespace, namespace per SSH target host
export const adapter = async (socket) => {
  let namespace = socket.nsp;
  let { host, username, password } = socket.handshake.query;
  let config = { host, username, password };
  console.log({ config });

  let ssh = new SSH2Promise(config);
  let shell = await ssh.shell();
  let sftp = new mySFTP(ssh);
  let list = getLister(sftp, namespace);

  // Initial List
  list();

  // Shell Events
  socket.on("data", async (data) => {
    shell.write(data);
    // If shell modifies FS... the frontend should know!
    if (data === "\r") list();
  });
  shell.on("data", (data) => {
    namespace.emit("data", data.toString("binary"));
  });

  // File System Events
  // https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
  socket.on("getFile", async (file) => {
    // Socket is in this file's room, for collaboration.
    // This should be constant time, since its invariant that the socket is in at most 2 rooms (default and file room)
    const old_rooms = [...socket.rooms].filter((room) => room != socket.id);
    old_rooms.forEach((room) => socket.leave(room));
    socket.join(file.path);
    // Send file
    const content = await sftp.readfile(file.path);
    socket.emit("sendFile", { node: file, content });
  });
  socket.on("writeFile", (path, content) => {
    sftp.writefile(path, content);
    // Send contents to everyone else editing this file right now
    socket.broadcast.to(path).emit("sendFileContent", content);
  });
  socket.on("deleteFile", (path) => {
    sftp.unlink(path);
    list();
  });
  socket.on("renameFile", (src, dest) => {
    sftp.rename(src, dest);
    list();
  });
  socket.on("makeDir", (path) => {
    sftp.mkdir(path);
    list();
  });
  socket.on("deleteDir", (path) => {
    sftp.rmdir(path);
    list();
  });

  // Close events
  socket.on("disconnect", () => {
    ssh.close();
  });
  shell.on("close", () => {
    ssh.close();
  });
  shell.on("error", () => {
    ssh.close();
  });
};
