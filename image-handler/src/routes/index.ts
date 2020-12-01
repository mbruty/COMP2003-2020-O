import v0 from "./V0/api.v0";
import express from "express";

const router = express.Router();
router.use("/api/v0", v0)
router.get("/test", (req, res) => {
  res.send("/test");
});

export default router;
