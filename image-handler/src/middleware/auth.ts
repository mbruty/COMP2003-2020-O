import express from "express";
import { apiURI } from "../constants";
const fetch = require("node-fetch");

const auth = async (
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  try {
    if (req.headers.cookie) {
      const result = await fetch(apiURI + "/authcheck", {
        method: "POST",
        headers: {
          cookie: req.headers.cookie,
        },
      });
      const response = await result.json();

      // This isn't neccesary as a bad login should throw an error...
      // but just incase
      if (response.message === "You are logged in") {
        next();
      } else {
        res.sendStatus(401);
      }
    } else {
      res.sendStatus(401);
    }
  } catch (e) {
    console.log(e);
    res.sendStatus(401);
  }
};

export default auth;
