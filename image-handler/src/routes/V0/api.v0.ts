import { auth } from "../../middleware";

const express = require("express");
const router = express.Router();

router.use(auth);

router.get("/", (req: any, res: any) => {
  res.send("Hello from v0");
});

export default router;
