import SSH2Promise from "ssh2-promise";
import mySFTP from "./sftp";

// Each namespace shares a shell
const shells = {};

// Socket listens to one client
// Broadcast across namespace, namespace per SSH target host
export const adapter = async (socket, history) => {
  let namespace = socket.nsp;
  let { host, username, password } = socket.handshake.query;
  let config = { host, username, password };
  console.log(config);

  let ssh = new SSH2Promise(config);
  let sftp = new mySFTP(ssh);

  if (shells[host] === undefined) {
    // First to playground
    try {
      shells[host] = await ssh.shell();
      await history.init(host);
      shells[host].on("data", (data) => {
        namespace.emit("data", data.toString());
        // no need to await this
        history.append(host, data);
      });
    } catch (e) {
      console.log(e);
      return socket.emit("ssh_error_connecting");
    }
  } else {
    // Not first, give user history
    socket.emit("data", await history.get(host));
  }

  // File System Events
  socket.on("getVisibleDirectoryLists", async (directoryPaths: string[]) => {
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
  });

  socket.on("getDirectoryList", async () => {
    let list = await sftp.readDirectoryByPath("/root");
    socket.emit("directoryList", list);
  });

  socket.on("getDirectoryChildren", async (path: string) => {
    let children;
    try {
      children = await sftp.readDirectoryByPath(path);
    } catch {
      // todo: error handling
      return;
    }
    socket.emit("directoryChildren", children);
  });

  // Shell Events
  socket.on("data", (data) => {
    shells[host].write(data);
  });

  // File System Explorer events
  // https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
  socket.on("getFile", async (file) => {
    let content;
    try {
      content = await sftp.readfile(file.path);
    } catch (e) {
      console.log(e);
      console.log({ file });
    }
    socket.emit("sendFile", { node: file, content });
  });
  socket.on("writeFile", (path, content) => {
    sftp.writefile(path, content);
  });
  socket.on("deleteFile", (path) => {
    sftp.unlink(path);
  });
  socket.on("renameFile", async ({ path, newPath }) => {
    await sftp.rename(path, newPath);
  });
  socket.on("makeDir", (path) => {
    sftp.mkdir(path);
  });
  socket.on("deleteDir", (path) => {
    sftp.rmdir(path);
  });

  // Search Events
  socket.on("searchByKeyword", (keyword) => {
    ssh.exec(`grep -rnw './' -e '.*${keyword}.*'`).then((response) => {
      try {
        const payload = {
          matches: response.split("\n").filter((s) => s.length > 0),
        };
        socket.emit("searchResult", payload);
      } catch {
        socket.emit("searchResult", "");
      }
    });
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
};
