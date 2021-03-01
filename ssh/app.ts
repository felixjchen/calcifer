import * as express from "express";

const port = 8080;
const app = express();

app.get("/", (req, res) => {
  res.send("Hello from ssh");
});

app.post("/", (req, res) => {});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server listening at http://localhost:${port}`);
});
