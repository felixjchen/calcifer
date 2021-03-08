import SSH2Promise from "ssh2-promise";
import SFTP from "ssh2-promise/dist/sftp";

export default class mySFTP extends SFTP {
  constructor(ssh: SSH2Promise) {
    super(ssh);
  }

  async readdir_r(path: string): Promise<object[]> {
    let list = await this.readdir(path);
    // Fill sub directories
    for (let i in list) {
      let file = list[i];
      file.path = `${path}/${file.filename}`;
      // If this is a directory
      if (file.longname[0] === "d") {
        file.children = await this.readdir_r(`${path}/${file.filename}`);
      }
    }
    return list;
  }

  // use read stream, more efficient, especially for larger files
  // https://medium.com/@dalaidunc/fs-readfile-vs-streams-to-read-text-files-in-node-js-5dd0710c80ea
  async readfile(path: string): Promise<string> {
    let file = "";
    let stream = await this.createReadStream(path, { encoding: "utf8" });
    // https://2ality.com/2018/04/async-iter-nodejs.html
    for await (const chunk of stream) {
      file += chunk;
    }
    return file;
  }

  // use write stream, more efficient, especially for larger files
  // https://stackabuse.com/writing-to-files-in-node-js/
  async writefile(path: string, content: string): Promise<void> {
    let stream = await this.createWriteStream(path);
    stream.write(content);
    return new Promise((resolve) => {
      stream.end(resolve);
    });
  }
}