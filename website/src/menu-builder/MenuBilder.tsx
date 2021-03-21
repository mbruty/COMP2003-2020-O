import { Paper } from "@material-ui/core";
import React from "react";
import { Observer } from "./FoodGridObserver";
import FoodItems from "./FoodItems";

interface Props {}

const MenuBuilder: React.FC<Props> = (props) => {
  const foodObserver = React.useMemo(() => new Observer(), []);

  return (
    <div
      className="grid" // Use the default grid container
      style={{
        gridTemplateColumns: "repeat(3, 1fr)", // We're using 3 columns here
        gridAutoRows: "calc(100vh - 64px - 25px - 1em)", // Onlyt using one row that will extend the entire page
      }}
    >
      <Paper style={{ gridColumn: "span 2", overflowY: "auto" }}></Paper>
      <Paper style={{ overflowY: "auto" }}>
        <FoodItems observer={foodObserver} />
      </Paper>
    </div>
  );
};

export default MenuBuilder;
