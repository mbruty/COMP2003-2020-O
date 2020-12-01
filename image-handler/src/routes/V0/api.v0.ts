import { auth } from "../../middleware";
import express from "express";
import axios from "axios";
import { apiURI } from "../../constants";

const router = express.Router();

router.use(auth);

router.get("/", (req, res) => {
  res.sendStatus(200);
});

export default router;
