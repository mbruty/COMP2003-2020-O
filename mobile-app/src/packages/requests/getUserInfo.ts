import { API_URL } from "../../constants";
import { includeAuth } from "../includeAuth";

export default async () => {
  const user = await includeAuth();
  const res = await fetch(API_URL + "/fetch/user/me", {
    headers: {
      authtoken: user.authtoken,
      userid: user.userid,
    },
  });
  const data = await res.json();
  console.log(data);
};
