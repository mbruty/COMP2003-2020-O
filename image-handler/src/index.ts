import routes from "./routes";
import express from "express";

const app = express();
const PORT = 8000;

app.use(routes);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
