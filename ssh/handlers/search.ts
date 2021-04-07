export const registerSearchHandlers = (socket, ssh) => {
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
