import express from "express";
import fs from "fs";
import path from "path";
import { auth } from "../../middleware";
const multer = require("multer");
const resizer = require("node-image-resizer");

const upload = multer({
  dest: "./tmp/",
});

const logo = {
  all: {
    path: "./images/logo/",
  },
  versions: [
    {
      prefix: "lg_",
      width: 680,
      height: 680,
      quality: 100,
    },
    {
      quality: 80,
      prefix: "small_",
      width: 48,
      height: 48,
    },
  ],
};

const router = express.Router();

router.post("/", upload.single("image"), auth, async (req: any, res) => {
  const ext = path.extname(req.file.originalname).toLowerCase();
  const user_id = req.headers.cookie.split("&user_id=")[1];
  const tmp_path = path.join(__dirname, "../../../tmp/" + user_id + ext);
  try {
    fs.rename(req.file.path, tmp_path, (err) => {
      if (err) throw err;
    });
    await resizer(tmp_path, logo);
    await fs.unlink(tmp_path, (err) => {
      if (err) throw err;
    });
  } catch (e) {
    console.log(e);
    res.sendStatus(500);
  }
  res.sendStatus(201);
});

module.exports = router;
