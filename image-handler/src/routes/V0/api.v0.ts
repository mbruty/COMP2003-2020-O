import { auth } from "../../middleware";
import express from "express";
import { apiURI } from "../../constants";

const images = require("./images");
const router = express.Router();

// router.use(auth);
router.use("/images", images);

export default router;
