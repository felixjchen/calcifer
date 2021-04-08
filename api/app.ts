import * as express from "express";
import * as body_parser from "body-parser";
import { db_init } from "./lib/db";
import { load_routers, pull_playground_images } from "./lib/util";
import { production, PORT } from "./config";

const app = express();
app.use(body_parser.json());

if (!production) {
  const cors = require("cors");
  app.use(cors());
}

const init = async () => {
  // Pull playground images, so we dont do this during request time
  pull_playground_images();
  // Init DB
  const models = await db_init();
  if (!production) {
    // Clear db on startup
    await models.Playgrounds.deleteMany({});
    console.log("reset mongo");
  }

  // Load all endpoints
  await load_routers(app, models);

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`api server at http://localhost:${PORT}`);
  });
};

init();
