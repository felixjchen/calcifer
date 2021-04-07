import SSH2Promise from "ssh2-promise";
import mySFTP from "./sftp";

// Each namespace shares the same backing shell
const shells = {};

// socket to ssh / sftp adapter
export const adapter = async (socket, history) => {
  let namespace = socket.nsp;
  let { host, username, password } = socket.handshake.query;
  let config = { host, username, password };
  console.log(`creating adapter for ${host}`);

  let ssh = new SSH2Promise(config);
  let sftp = new mySFTP(ssh);

  // Connect to ssh instance
  try {
    if (shells[host] === undefined) {
      // First to playground, create shell
      // https://www.npmjs.com/package/ssh2 , search for Pseudo-TTY settings
      shells[host] = await ssh.shell({ cols: 150 });
      await history.init(host);
      shells[host].on("data", (data) => {
        namespace.emit("shellData", data.toString());
        history.append(host, data);
      });
      // Close events
      shells[host].on("close", (e) => {
        console.log("ssh closed for host", host);
        ssh.close();
      });
      shells[host].on("error", (e) => {
        console.log("ssh closed for host", host, e);
        ssh.close();
      });
    } else {
      // Not first, give user history from Redis
      socket.emit("shellData", await history.get(host));
    }
  } catch (err) {
    socket.emit("backendError", err.messages);
    return socket.emit("ssh_error_connecting");
  }

  // Shell Events
  socket.on("shellData", (data) => {
    try {
      shells[host].write(data);
    } catch (err) {
      socket.emit("backendErrorMessage", err.message);
    }
  });

  // File Explorer Diff Tree events
  socket.on("getVisibleDirectoryLists", async (directoryPaths: string[]) => {
    try {
      const directoryPromises = [];
      (directoryPaths ?? []).forEach((directoryPath) =>
        directoryPromises.push(sftp.readDirectoryByPath(directoryPath))
      );
      const files = await Promise.all(directoryPromises);
      const directoryFiles = directoryPaths.map((path, index) => ({
        path,
        files: files[index],
      }));
      socket.emit("visibleDirectoryLists", directoryFiles);
    } catch (err) {
      socket.emit("backendError", err.messages);
    }
  });

  socket.on("getDirectoryList", async () => {
    try {
      const list = await sftp.readDirectoryByPath("/root");
      socket.emit("directoryList", list);
    } catch (err) {
      socket.emit("backendError", err.messages);
    }
  });
  socket.on("getDirectoryChildren", async (path: string) => {
    try {
      const children = await sftp.readDirectoryByPath(path);
      socket.emit("directoryChildren", children);
    } catch (err) {
      socket.emit("backendError", err.messages);
    }
  });

  // File System events
  // https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
  socket.on("getFile", async (file) => {
    try {
      let content = await sftp.readfile(file.path);
      socket.emit("sendFile", { node: file, content });
    } catch (err) {
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

  // Search Events
  socket.on("searchByKeyword", async (keyword) => {
    try {
      let grep = await ssh.exec(`grep -rnw './' -e '.*${keyword}.*'`);
      const payload = {
        matches: grep.split("\n").filter((s) => s.length > 0),
      };
      socket.emit("searchResult", payload);
    } catch (err) {
      socket.emit("backendErrorMessage", err.message);
    }
  });
};
