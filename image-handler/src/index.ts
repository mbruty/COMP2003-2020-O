import routes from "./routes";
import auth from "./middleware/auth";
import express from "express";
import path from "path";
const app = express();
const PORT = 8000;

app.use(routes);
app.use(auth);
app.use("/img/", express.static(path.join(__dirname, "../images")));

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
