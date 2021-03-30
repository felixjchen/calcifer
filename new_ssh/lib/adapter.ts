import SSH2Promise from "ssh2-promise";
import mySFTP from "./SFTP";

// Returns a function that lists files across namespace
const getLister = (sftp, socket) => async () => {
  let list = await sftp.readdir_r("/root");
  socket.emit("list", list);
};

// Socket listens to one client
// Broadcast across namespace, namespace per SSH target host
export const adapter = async (socket, config) => {
  // let namespace = socket.nsp;
  // let { host, username, password } = socket.handshake.query;
  // let config = { host, username, password };
  console.log({ config });

  let ssh = new SSH2Promise(config);
  let shell: any;

  try {
    shell = await ssh.shell();
  } catch {
    socket.emit("ssh_error_connecting");
    return;
  }

  let sftp = new mySFTP(ssh);
  let list = getLister(sftp, socket);

  // // Shell Events
  // socket.on("data", (data) => {
  //   shell.write(data);
  // });
  // shell.on("data", (data) => {
  //   namespace.emit("data", data.toString("binary"));
  // });

  // socket.on("searchByKeyword", (keyword) => {
  //   ssh.exec(`grep -rnw './' -e '.*${keyword}.*'`).then((response) => {
  //     try {
  //       const payload = {
  //         matches: response.split("\n").filter((s) => s.length > 0),
  //       };
  //       socket.emit("searchResult", payload);
  //     } catch {
  //       socket.emit("searchResult", "");
  //     }
  //   });
  // });

  // // File System Events
  // // https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
  // list();
  // socket.on("getList", () => {
  //   list();
  // });

  // socket.on("getFile", async (file) => {
  //   // Socket is in this file's room, for collaboration.
  //   // This should be constant time, since its invariant that the socket is in at most 2 rooms (default and file room)
  //   // const old_rooms = [...socket.rooms].filter((room) => room != socket.id);
  //   // old_rooms.forEach((room) => socket.leave(room));
  //   // socket.join(file.path);
  //   // Send file
  //   const content = await sftp.readfile(file.path);
  //   socket.emit("sendFile", { node: file, content });
  // });
  // socket.on("writeFile", (path, content) => {
  //   sftp.writefile(path, content);
  //   // Send contents to everyone else editing this file right now
  //   // socket.broadcast.to(path).emit("sendFileContent", content);
  // });
  // socket.on("deleteFile", (path) => {
  //   sftp.unlink(path);
  // });
  // socket.on("renameFile", (src, dest) => {
  //   sftp.rename(src, dest);
  // });
  // socket.on("makeDir", (path) => {
  //   sftp.mkdir(path);
  // });
  // socket.on("deleteDir", (path) => {
  //   sftp.rmdir(path);
  // });

  // // Close events
  // socket.on("disconnect", () => {
  //   ssh.close();
  // });
  // shell.on("close", () => {
  //   ssh.close();
  // });
  // shell.on("error", () => {
  //   ssh.close();
  // });
};
