import React, { useEffect } from "react";
import FormGroup from "@material-ui/core/FormGroup";
import TextField from "@material-ui/core/TextField";
import {
  Button,
  Paper,
} from "@material-ui/core";
import get = Reflect.get;

let UserPassword = "";
let ConfirmPassword = "";

interface Props {}

const signUp: React.FC<Props> = () => {
  return(
      <div className="content">
        <h1>Welcome to Track and Taste</h1>
        <h2>Not already a user? Sign up here</h2>

        <Paper style={{ padding: "3em", marginBottom: "3em", maxWidth: "800px" }}>
          <FormGroup>
            <h2>Sign up</h2>
            <h3>Email</h3>
            <TextField
                variant="outlined"
                id="userEmail"
                label="Your email"
            />
            <h3>Password</h3>
            <TextField
                variant="outlined"
                id="userPassword"
                label="Your password"
                onChange={(e) => UserPassword = e.target.value}
            />
            <h3>Confirm password</h3>
            <TextField
                variant="outlined"
                id="confirmPassword"
                label="Conform your email"
                onChange={(e) => ConfirmPassword = e.target.value}
            />
            <Button color="primary" style={{ margin: "auto 0px auto auto" }}
                    onClick={() => {if(UserPassword == ConfirmPassword) console.log("Passwords match")}}
            >
              Sign Up!
            </Button>
          </FormGroup>
        </Paper>

      </div>
  )
}