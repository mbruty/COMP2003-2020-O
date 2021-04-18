import React from "react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import {
  Button,
  Collapse,
  FormControlLabel,
  FormLabel,
  IconButton,
  Paper,
} from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { Close, Save } from "@material-ui/icons";
import { API_URL } from "../constants";

interface Props {}

const TagBuilder: React.FC<Props> = () => {
  const [checked, setChecked] = React.useState(false);
  const [data, setData] = React.useState<string>("");
  const [errors, setErrors] = React.useState<string>("");
  const [success, setSuccess] = React.useState<boolean>(false);
  console.log(data);

  return (
    <div className="content">
      <Collapse in={success}>
        <Alert
          variant="filled"
          severity="success"
          className={`save-toast${success ? " visible" : ""}`}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setSuccess(false);
              }}
            >
              <Close fontSize="inherit" />
            </IconButton>
          }
        >
          Tag submitted!
        </Alert>
      </Collapse>
      <h1>Welcome to the Track and Taste Community Food Tags Page</h1>
      <h3>Can't find the right tag for you? Why not recommend it to us</h3>
      <span>
        <hr />
      </span>

      <Paper style={{ marginBottom: "3rem", padding: "2rem" }}>
        <h2>Submit your own Tag</h2>
        <h3>Create a tag that your fellow restaurant owners can vote on</h3>
        <FormGroup>
          <TextField
            id="tag-name"
            label="Tag Name"
            margin="normal"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={checked}
                onChange={() => setChecked((p) => !p)}
                inputProps={{ "aria-label": "primary checkbox" }}
              />
            }
            label="I accept that this tag will be visible and available to be voted on"
          />
          <br />
          <br />
          {errors && <p style={{ color: "firebrick" }}>{errors}</p>}
          <Button
            variant="contained"
            color="primary"
            size="large"
            startIcon={<Save />}
            onClick={async () => {
              if (!checked) {
                setErrors("Please accept the terms");
                return;
              }

              if (!data) {
                setErrors("Please enter a tag!");
                return;
              }

              // Send the data off
              const response = await fetch(
                API_URL + "/foodtags/create",
                {
                  body: JSON.stringify({
                    name: data,
                  }),
                  method: "POST",
                  credentials: "include",
                  mode: "cors",
                }
              );

              // 201 - Created || 208 - We can ignore if they have been already created
              if (response.status === 201 || response.status === 208) {
                setData("");
                setErrors("");
                setSuccess(true);
                setTimeout(() => {
                  setSuccess(false);
                }, 5000)
              } else {
                setErrors("There was an error in creating this tag");
              }
            }}
          >
            Save
          </Button>
        </FormGroup>

        <span>
          <hr />
        </span>

        <h2>Manage your Tags</h2>
        <FormGroup>
          <textarea>V User tags will be shown here V</textarea>
          <br />
          <br />
          <button>Edit a Tag</button>
          <br />
          <br />
          <button>Delete a Tag</button>

          <h4>Arrange Tags</h4>
          <button>Most Popular</button>
          <button>Least Popular</button>
          <button>Name</button>
          <button>Date Added</button>
        </FormGroup>
        <span>
          <hr />
        </span>
      </Paper>

      <Paper style={{ marginBottom: "3rem", padding: "2rem" }}>
        <h2>Tags of the Week</h2>
        <h3>See the most popular tags promoted by the community</h3>
        <FormGroup>
          <FormGroup>
            <h4>Filter by:</h4>
            <button>Most Popular</button>
            <button>Most Recent</button>
            <button>Name</button>
          </FormGroup>
          <br />
          <br />
          <textarea>V Tags of the week will go here V</textarea>

          <h2>Congratulations to our newest verified tags</h2>
          <h3>You voted for them, and we added them</h3>
          <textarea>V Most Recent Verified Tags will go here V</textarea>
        </FormGroup>

        <span>
          <hr />
        </span>
      </Paper>

      <Paper style={{ marginBottom: "3rem", padding: "2rem" }}>
        <h2>Newly added Tags</h2>
        <h3>See the most recent tags submitted by the community</h3>
        <textarea>
          V All tags recently created will go here that aren't featured on the
          TotW V
        </textarea>
        <FormGroup>
          <h4>Filter by:</h4>
          <button>Most Popular</button>
          <button>Least Popular</button>
          <button>Most Recent</button>
        </FormGroup>
      </Paper>
    </div>
  );
};

export default TagBuilder;
