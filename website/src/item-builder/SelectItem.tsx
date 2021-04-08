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
import { API_URL } from "../constants";

const SelectItem: React.FC = (props) => {
  const history = useHistory();
  const [items, setItems] = React.useState<
    Array<{ FoodName: string; FoodID: number }>
  >([]);

  React.useEffect(() => {
    (async () => {
      const raw = await fetch(API_URL + "/fooditem/me", {
        mode: "cors",
        credentials: "include",
      });
      const data = await raw.json();

      setItems(data.items);
    })();
  }, []);
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
              <MenuItem value={item.FoodID}>{item.FoodName}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider style={{ margin: "10px" }} />
        <Button
          onClick={() => history.push("item-builder/create")}
          style={{ width: "100%" }}
        >
          <Add style={{ paddingRight: "10px" }} />
          Create New
        </Button>
      </Paper>
    </div>
  );
};

export default SelectItem;
