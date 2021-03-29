import { Button, ButtonGroup } from "@material-ui/core";
import { Add } from "@material-ui/icons";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Menu, MenuObserver } from "./MenuObserver";
import MenuAccordion from "./MenuAccordion";

const MenuContainer: React.FC<{ observer: MenuObserver }> = (props) => {
  const [menus, setMenus] = React.useState<Menu[]>();
  React.useEffect(() => props.observer.subscribe(setMenus), []);

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2 style={{ textAlign: "center" }}> Your Menus</h2>
        <ButtonGroup
          aria-label="text primary button group"
          style={{ justifyContent: "center", width: "100%" }}
        >
          <Button onClick={() => props.observer.createNewMenu()}>
            <Add style={{ paddingRight: 5 }} /> Create a new menu
          </Button>
        </ButtonGroup>
        {menus &&
          menus.map((menu) => (
            <MenuAccordion menu={menu} observer={props.observer} />
          ))}
      </div>
    </DndProvider>
  );
};

export default MenuContainer;
