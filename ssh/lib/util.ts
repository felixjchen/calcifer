// Returns a function that lists files across namespace
export const getLister = (sftp, socket) => async () => {
  let list = await sftp.readdir_r("/root");
  socket.emit("list", list);
};
