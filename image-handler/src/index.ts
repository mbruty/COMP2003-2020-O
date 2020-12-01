import routes from "./routes";
const express = require("express");
const app = express();
const PORT = 8000;

app.use(routes);

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
