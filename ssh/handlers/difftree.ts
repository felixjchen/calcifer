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
};
