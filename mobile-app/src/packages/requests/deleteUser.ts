import { API_URL } from "../../constants";
import { includeAuth } from "../includeAuth";

export default async () => {
  const auth = await includeAuth();
  console.log("deleting user");
  await fetch(API_URL + "/modify/user", {
    method: "DELETE",
    headers: {
      authtoken: auth.authtoken,
      userid: auth.userid,
    },
  });
};
