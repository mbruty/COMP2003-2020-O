import v0 from "./V0/api.v0";
const express = require("express");

const router = express.Router();
router.use("/api/v0", v0)
router.get("/test", (req: any, res: any) => {
  res.send("/test");
});

export default router;
