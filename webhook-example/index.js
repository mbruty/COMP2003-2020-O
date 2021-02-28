const express = require("express");
const app = express();
const bodyParser = require('body-parser')

const PORT = 5001;

app.use(bodyParser.json());

app.post("/book", (req, res) => {
  console.log(req.body);
  res.sendStatus(201);
});

app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`);
});
