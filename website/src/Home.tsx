import React from "react";
import { useHistory } from "react-router";
import IUser from "./interfaces/IUser";
interface Props {
  user: IUser;
}

const Home: React.FC<Props> = (props) => {
  const history = useHistory();
  if (props.user.authToken) {
    return <h1>Home Page</h1>;
  } else {
    history.push("log-in");
  }
  return null;
};

export default Home;
