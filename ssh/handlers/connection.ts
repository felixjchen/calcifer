import SSH2Promise from "ssh2-promise";
import { registerDiffTreeEvents } from "./difftree";
import { registerFileHandlers } from "./file";
import { registerSearchHandlers } from "./search";

export const connectionHandler = async (socket, shells, shell_history) => {
  let namespace = socket.nsp;
  let { host, username, password } = socket.handshake.query;
  let ssh = new SSH2Promise({ host, username, password });
  console.log(`connection for ${host}`);

  // Connect to ssh instance
  try {
    let shell;
    if (!(host in shells)) {
      // First to playground, create shell
      console.log(`creating shell for ${host}`);

      // https://www.npmjs.com/package/ssh2 , search for Pseudo-TTY settings
      shell = await ssh.shell({ cols: 150 });
      await shell_history.initKey(host);

      // Shell -> Clients
      shell.on("data", (data) => {
        data = data.toString();
        shell_history.append(host, data);
        namespace.emit("shellData", data);
      });
      // Shell close events
      shell.on("close", () => {
        socket.emit("ssh_error_connecting");
        ssh.close();
      });
      shell.on("error", () => {
        socket.emit("ssh_error_connecting");
        ssh.close();
      });

      // Store shell in memory
      shells[host] = shell;
    } else {
      // Not first, give user shell_history from Redis
      socket.emit("shellData", await shell_history.get(host));
      shell = shells[host];
    }

    // Client -> Shell
    socket.on("shellData", (data) => {
      try {
        shell.write(data);
      } catch (err) {
        socket.emit("backendErrorMessage", err.message);
      }
    });

    // Destroyed playground
    socket.on("destroy", () => {
      try {
        namespace.emit("destroy");
      } catch (err) {
        socket.emit("backendErrorMessage", err.message);
      }
    });
  } catch (err) {
    socket.emit("backendError", err.messages);
    return socket.emit("ssh_error_connecting");
  }

  registerDiffTreeEvents(socket, ssh);
  registerSearchHandlers(socket, ssh);
  registerFileHandlers(socket, ssh);
};
