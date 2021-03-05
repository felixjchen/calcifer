import SSH2Promise from "ssh2-promise";
import mySFTP from "./SFTP";


// https://nodesource.com/blog/understanding-streams-in-nodejs/
const readableToString = async (readable) => {
  let result = '';
  for await (const chunk of readable) {
    result += chunk;
  }
  return result;
}

const readRemotePath = async (sftp, path) => {
  const stream = await sftp.createReadStream(path);
  return await readableToString(stream);
}

// list recursive
let readdir_r = async (sftp, path) => {
  let list = await sftp.readdir(path);
  // Fill sub directories
  for (let i in list) {
    let file = list[i];
    file.path = path;
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
  console.log({ host, username, password })
  let ssh = new SSH2Promise(config);
  // SFTP
  let sftp = new mySFTP(ssh);
  let list = await sftp.readdir_r("/root");
  namespace.emit("list", list);

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

  socket.on('getFile', async (file) => {
    console.log(file);
    const content = await readRemotePath(sftp, `${file.path}/${file.filename}`);
    socket.emit('sendFile', { node: file, content })
  })

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
