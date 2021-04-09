import mySFTP from "../lib/sftp";

export const registerFileHandlers = (socket, ssh) => {
  const sftp = new mySFTP(ssh);
  // File  events
  // https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
  socket.on("getFile", async (file) => {
    try {
      let content = await sftp.readfile(file.path);
      socket.emit("sendFile", { node: file, content });
    } catch (err) {
      socket.emit('fileNotFound', file);
      socket.emit("backendErrorMessage", err.message);
    }
  });
  socket.on("writeFile", ({ path, content }) => {
    try {
      sftp.writefile(path, content);
    } catch (err) {
      socket.emit("backendErrorMessage", err.message);
    }
  });
  socket.on("deleteFile", (path) => {
    try {
      sftp.unlink(path);
    } catch (err) {
      socket.emit("backendErrorMessage", err.message);
    }
  });
  socket.on("renameFile", async ({ path, newPath }) => {
    try {
      sftp.rename(path, newPath);
    } catch (err) {
      socket.emit("backendErrorMessage", err.message);
    }
  });
  socket.on("makeDir", (path) => {
    try {
      sftp.mkdir(path);
    } catch (err) {
      socket.emit("backendErrorMessage", err.message);
    }
  });
  socket.on("deleteDir", (path) => {
    try {
      sftp.rmdir(path);
    } catch (err) {
      socket.emit("backendErrorMessage", err.message);
    }
  });
};
