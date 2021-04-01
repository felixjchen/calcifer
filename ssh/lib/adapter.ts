import SSH2Promise from "ssh2-promise";
import { getLister } from "./util";
import mySFTP from "./SFTP";

// Each namespace shares a shell
const shells = {};
// Keep hostnames for nice prompt
const hostnames = {};

// Socket listens to one client
// Broadcast across namespace, namespace per SSH target host
export const adapter = async (socket) => {
  let namespace = socket.nsp;
  let { host, username, password } = socket.handshake.query;
  let config = { host, username, password };
  console.log(config);

  let ssh = new SSH2Promise(config);
  if (shells[host] === undefined) {
    // First to playground
    try {
      shells[host] = await ssh.shell();
      shells[host].on("data", (data) => {
        namespace.emit("data", data.toString("binary"));
      });
      // Get hostname for other's first prompt
      hostnames[host] = (await ssh.exec(`hostname`)).trim();
    } catch (e) {
      console.log(e);
      return socket.emit("ssh_error_connecting");
    }
  } else {
    // Not first, show nice prompt
    const prompt = `${hostnames[host]}:~# `;
    socket.emit("data", prompt);
  }
  let sftp = new mySFTP(ssh);
  let list = getLister(sftp, socket);

  // File System Events
  list();
  socket.on("getList", () => {
    list();
  });

  // Shell Events
  socket.on("data", (data) => {
    shells[host].write(data);
    // Enter means we likely need to update FS
    if ("\r" === data) list();
  });

  // File System Explorer events
  // https://github.com/mscdex/ssh2-streams/blob/master/SFTPStream.md
  socket.on("getFile", async (file) => {
    const content = await sftp.readfile(file.path);
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
    list();
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
