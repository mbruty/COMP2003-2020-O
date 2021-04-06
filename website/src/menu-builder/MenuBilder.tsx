import { Paper } from "@material-ui/core";
import React from "react";
import { Observer } from "./FoodGridObserver";
import { MenuObserver } from "./MenuObserver";
import FoodItems from "./FoodItems";
import MenuContainer from "./MenuContainer";
import { API_URL } from "../constants";

interface Props {}

const MenuBuilder: React.FC<Props> = (props) => {
  const [data, setData] = React.useState();
  React.useEffect(() => {
    (async () => {
      const raw = await fetch(API_URL + "/menu/me/with-items", {
        credentials: "include",
      });
      const body = await raw.json();
      setData(body);
    })();
  }, []);
  const foodObserver = React.useMemo(() => new Observer(data), [data]);
  const menuObserver = React.useMemo(() => new MenuObserver(data), [data]);
  return (
    <div
      className="grid" // Use the default grid container
      style={{
        gridTemplateColumns: "repeat(3, 1fr)", // We're using 3 columns here
        gridAutoRows: "calc(100vh - 64px - 25px - 1em)", // Onlyt using one row that will extend the entire page
      }}
    >
      <Paper style={{ gridColumn: "span 2", overflowY: "auto" }}>
        <MenuContainer observer={menuObserver} />
      </Paper>
      <Paper style={{ overflowY: "auto" }}>
        <FoodItems observer={foodObserver} />
      </Paper>
    </div>
  );
};

export default MenuBuilder;
