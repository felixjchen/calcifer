import * as express from "express";
import * as body_parser from "body-parser";
import { db_init } from "./lib/db";
import { load_routers } from "./lib/util";

const port = 8080;
const app = express();
app.use(body_parser.json());

const init = async () => {
  // Init DB
  const models = await db_init();
  // Load all endpoints
  await load_routers(app, models);

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

init();
