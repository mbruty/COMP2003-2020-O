import React, { useEffect } from "react";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {
  Button,
  Collapse,
  Divider,
  IconButton,
  Paper,
} from "@material-ui/core";

interface Props {}

const signUp: React.FC<Props> = () => {
  return(
      <div className="content">
        <h1>Welcome to Track and Taste</h1>
        <h2>Not already a user? Sign up here</h2>

        <Paper style={{ padding: "3em", marginBottom: "3em", maxWidth: "800px" }}>
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
          />
          <h3>Confirm password</h3>
          <TextField
              variant="outlined"
              id="confirmPassword"
              label="Conform your email"
          />
          <Button color="primary" style={{ margin: "auto 0px auto auto" }}>
              Sign Up!
          </Button>
        </Paper>

      </div>
  )
}