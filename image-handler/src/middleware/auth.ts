import Axios from "axios";
import express from "express";
import { apiURI } from "../constants";

const auth = (
  req: express.Request,
  res: express.Response,
  next: () => void
) => {
  Axios({
    method: "POST",
    url: apiURI + "/authcheck",
    headers: {
      authtoken: req.headers.authtoken,
      userid: req.headers.userid,
    },
  })
    .then((response) => {
      // This isn't neccesary as a bad login should throw an error...
      // but just incase
      if (response.data.message === "You are logged in") {
        next();
      } else {
        res.sendStatus(401);
      }
    })
    .catch((err) => res.sendStatus(401));
};

export default auth;
