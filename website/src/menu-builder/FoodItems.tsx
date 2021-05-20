import { Button, ButtonGroup } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { useHistory } from "react-router";
import { Observer, FoodGrid } from "./FoodGridObserver";
import FoodGroup from "./FoodGroup";

interface Props {
  observer: Observer;
}

const FoodItems: React.FC<Props> = (props) => {
  const [items, setItems] = React.useState<FoodGrid>();
  const history = useHistory();

  React.useEffect(
    () =>
      props.observer.subscribe((items: FoodGrid | undefined) => {
        if (items) setItems(items);
      }),
    [props.observer]
  );
  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2 style={{ textAlign: "center" }}> Your food items</h2>
        <ButtonGroup
          aria-label="text primary button group"
          style={{ justifyContent: "center", width: "100%" }}
        >
          <Button onClick={() => history.push("/item-builder/create")}>
            <Add style={{ paddingRight: 5 }} /> Create a food item
          </Button>
          <Button onClick={() => props.observer.createNewGroup()}>
            <Add style={{ paddingRight: 5 }} /> Create a group
          </Button>
        </ButtonGroup>

        {items
          ? items.groups.map((group) => (
              <FoodGroup group={group} observer={props.observer} />
            ))
          : null}
      </div>
    </DndProvider>
  );
};

export default FoodItems;
