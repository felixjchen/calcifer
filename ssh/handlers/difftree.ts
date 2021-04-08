import mySFTP from "../lib/sftp";

export const registerDiffTreeEvents = (socket, ssh) => {
  const sftp = new mySFTP(ssh);

  // File Explorer Diff Tree events
  socket.on("getVisibleDirectoryLists", async (directoryPaths: string[]) => {
    try {
      const directoryPromises = [];
      (directoryPaths ?? []).forEach((directoryPath) =>
        directoryPromises.push(sftp.readDirectoryByPath(directoryPath))
      );

      let directoryFiles = await Promise.allSettled(directoryPromises)
        .then((results) => results.filter(result => result.status === 'fulfilled'))
        .then((results) => results.map(result => (result as any).value));

      socket.emit("visibleDirectoryLists", directoryFiles);
    } catch (err) {
      socket.emit("backendError", err);
    }
  });
  socket.on("getDirectoryList", async () => {
    try {
      const { files } = await sftp.readDirectoryByPath("/root");
      socket.emit("directoryList", files);
    } catch (err) {
      socket.emit("backendError", err.messages);
    }
  });
  socket.on("getDirectoryChildren", async (path: string) => {
    try {
      const { files } = await sftp.readDirectoryByPath(path);
      socket.emit("directoryChildren", files);
    } catch (err) {
      socket.emit("backendError", err.messages);
    }
  });
};
