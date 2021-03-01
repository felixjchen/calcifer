// Node imports
import * as chalk from "chalk";

// Create a logger that logs in a color
const getLogger = (name: string, color: chalk.Chalk) => {
  const logger = (...args: any[]) => {
    args.unshift(`[${name}]`);
    args = args.map((s) => color(s));
    console.log(...args);
  };

  return logger;
};

const error = getLogger("error", chalk.red);
const success = getLogger("success", chalk.green);
const info = getLogger("info", chalk.yellow);
const log = console.log;

export { error, success, info, log };
