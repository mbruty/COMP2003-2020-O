import React from "react";
import TextField from "@material-ui/core/TextField";
import Checkbox from "@material-ui/core/Checkbox";
import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";

interface Props {}

  const [checked, setChecked] = React.useState(true);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setChecked(event.target.checked);}

const TagBuilder: React.FC<Props> = () => {
    return (
        <div className="content">
            <h1>Welcome to the Track and Taste Community Food Tags Page</h1>
            <h3>Can't find the right tag for you? Why not recommend it to us</h3>
            <span><hr/></span>
            <div>
              <h2>Submit your own Tag</h2>
              <h3>Create a tag that your fellow restaurant owners can vote on</h3>
              <TextField
                  id="tag-name"
                  label="Tag Name"
                  margin="normal"
              />
              <label>I accept that this tag will be visible and available to be voted on</label>
              <Checkbox
                  checked={false}
                  onChange={handleChange}
                  inputProps={{ 'aria-label': 'primary checkbox' }}
              />
              <button>Submit Your Tag</button>
              <span><hr/></span>
            </div>
          <div>
            <h2>Tags of the Week</h2>
            <h3>See the most popular tags promoted by the community</h3>
            <textarea>
              V Tags of the week will go here V
            </textarea>
          </div>
            </div>

    );
};

export default TagBuilder;