import * as express from "express";
import * as body_parser from "body-parser";
import { db_init } from "./lib/db";
import { load_routers, pull_playground_images } from "./lib/util";
import { production } from "./config";

const port = 8080;
const app = express();
app.use(body_parser.json());

if (!production) {
  const cors = require("cors");
  app.use(cors());
}

const init = async () => {
  // Pull images
  // await pull_playground_images();
  // Init DB
  const models = await db_init();
  // Load all endpoints
  await load_routers(app, models);

  app.listen(port, "0.0.0.0", () => {
    console.log(`api server at http://localhost:${port}`);
  });
};

init();
