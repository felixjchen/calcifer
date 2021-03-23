import * as express from "express";
import { db_init } from "./lib/db";
import { load_routers } from "./lib/util";
// import { get_playground_router } from "./routes/playgrounds";

const port = 8080;
const app = express();

const init = async () => {
  const models = await db_init();
  await load_routers(app, models);

  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

init();
