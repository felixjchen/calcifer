import * as express from "express";
import { db_init } from "./lib/db";
import { get_playground_router } from "./routes/playgrounds";

const port = 8080;
const app = express();

const init = async () => {
  const models = await db_init();

  const playground_router = get_playground_router(models);

  app.use("/api", playground_router);
  app.listen(port, "0.0.0.0", () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
};

init();
