import { TextField } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import React from "react";
import { API_URL } from "../constants";
import { useHistory } from "react-router-dom";

interface SignIn {
  email: string;
  password: string;
}

const LogInForm: React.FC = () => {
  const [details, setDetails] = React.useState<SignIn>({
    email: "",
    password: "",
  });

  const history = useHistory();

  const [errorText, setErrorText] = React.useState<string>("");

  return (
    <form
      className="login-container"
      onSubmit={async (e) => {
        // Stop the page from refreshing
        e.preventDefault();

        // Check validity from server
        // If it's good, the server will send back a cookie
        // The cookie will automatically get saved

        const result = await fetch(API_URL + "/login", {
          method: "POST",
          credentials: "include",
          body: JSON.stringify({
            email: details.email,
            password: details.password,
          }),
        });

        if (result.status === 401) {
          setErrorText("Invalid email or password");
        } else if (result.status === 200) {
          // We're logged in!
          // Redirect to home
          history.push("/");
        } else {
          setErrorText("An unexpected error occurred");
        }
      }}
    >
      <TextField
        id="email"
        label="Email"
        variant="outlined"
        type="email"
        onChange={(e) => {
          setDetails({ ...details, email: e.target.value });
        }}
        value={details.email}
      />
      <TextField
        id="password"
        label="Password"
        variant="outlined"
        type="password"
        onChange={(e) => {
          setDetails({ ...details, password: e.target.value });
        }}
        value={details.password}
      />
      <Button type="submit" variant="contained" color="primary">
        Log in
      </Button>
      {errorText !== "" && <p>{errorText}</p>}
    </form>
  );
};

export default LogInForm;
