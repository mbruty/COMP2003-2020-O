import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { API_URL } from "./constants";

const Home: React.FC = (props) => {
  const history = useHistory();
  useEffect(() => {
    fetch(API_URL + "/authcheck", {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then((response) => {
      if (response.status === 401) {
        history.push("/log-in");
      }
    });
  }, []);
  return <h1>Home Page</h1>;
};

export default Home;
