import {
  Button,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
} from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React from "react";
import { useHistory } from "react-router";

const SelectItem: React.FC = (props) => {
  const history = useHistory();
  const [items, setItems] = React.useState<Array<{ name: string; id: number }>>(
    [
      {
        name: "BLT Burger",
        id: 3,
      },
      {
        name: "Quokka",
        id: 1,
      },
    ]
  );
  return (
    <div className="content">
      <Paper style={{ padding: "1em" }}>
        <h2>Select item to edit</h2>
        <FormControl style={{ width: "100%" }}>
          <InputLabel id="food-item-select">Item</InputLabel>
          <Select
            labelId="food-item-drop-down"
            id="food-item-drop-down"
            onChange={(e) => history.push(`item-builder/${e.target.value}`)}
          >
            {items.map((item) => (
              <MenuItem value={item.id}>{item.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider style={{ margin: "10px" }} />
        <Button onClick={() => history.push("item-builder/create") } style={{ width: "100%" }}>
          <Add style={{ paddingRight: "10px" }} />
          Create New
        </Button>
      </Paper>
    </div>
  );
};

export default SelectItem;
