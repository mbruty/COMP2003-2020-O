import {
  Button,
  ButtonGroup,
  Modal,
  Paper,
  TextField,
} from "@material-ui/core";
import { Add, Cancel, CancelOutlined, Close, Save } from "@material-ui/icons";
import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Menu, MenuObserver } from "./MenuObserver";
import MenuAccordion from "./MenuAccordion";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import { RestaurantContext } from "../RestaurantContext";

const MenuContainer: React.FC<{ observer: MenuObserver }> = (props) => {
  const [menus, setMenus] = React.useState<Menu[]>();
  const [showModal, setShowModal] = React.useState<boolean>(false);
  const [newMenuName, setNewMenuName] = React.useState<string>("");
  React.useEffect(() => props.observer.subscribe(setMenus), [props.observer]);

  const handleModalClose = () => {
    setShowModal(false);
    setNewMenuName("");
  };
  return (
    <DndProvider backend={HTML5Backend}>
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={showModal}
        onClose={handleModalClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={showModal}>
          <Paper className="absolute-centre">
            <h2 id="transition-modal-title">Create a new menu</h2>
            <TextField
              value={newMenuName}
              onChange={(e) => setNewMenuName(e.target.value)}
              style={{ width: "100%" }}
              label="Menu name"
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: "2em",
              }}
            >
              <Button onClick={handleModalClose}>
                <Close /> Cancel
              </Button>
              <RestaurantContext.Consumer>
                {(restaurant) => (
                  <Button
                    color="primary"
                    onClick={() => {
                      props.observer.createNewMenu(newMenuName, restaurant.id);
                    }}
                  ><Save /> Save</Button>
                )}
              </RestaurantContext.Consumer>
            </div>
          </Paper>
        </Fade>
      </Modal>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h2 style={{ textAlign: "center" }}> Your Menus</h2>
        <ButtonGroup
          aria-label="text primary button group"
          style={{ justifyContent: "center", width: "100%" }}
        >
          <Button onClick={() => setShowModal(true)}>
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
