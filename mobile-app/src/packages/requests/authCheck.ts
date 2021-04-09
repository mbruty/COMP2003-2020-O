import { API_URL } from "../../constants";
import { includeAuth } from "../includeAuth";

export default async () => {
  return true;
  const auth = await includeAuth();
  if (!auth) return false;
  const res = await fetch(API_URL + "/user/authcheck", {
    method: "POST",
    body: JSON.stringify({
      authtoken: auth.authtoken,
      userid: auth.userid,
    }),
  });
  if (res.status === 200) {
    return true;
  } else {
    return false;
  }
};
