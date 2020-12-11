import express from "express";
import fs from "fs";
import path from "path";
const multer = require("multer");

const upload = multer({
  dest: "./tmp/",
});

const router = express.Router();

router.post("/", upload.single("image"), (req: any, res) => {
  const ext = path.extname(req.file.originalname).toLowerCase();
  fs.rename(
    req.file.path,
    path.join(__dirname, "../../../images/image" + ext),
    (err) => {
      if (err) console.log(err);
    }
  );
  res.sendStatus(201);
});

module.exports = router;
