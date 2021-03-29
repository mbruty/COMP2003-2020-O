import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Checkbox,
  createStyles,
  FormControlLabel,
  FormGroup,
  InputBase,
  makeStyles,
  Modal,
  Paper,
  Theme,
  Typography,
} from "@material-ui/core";
import { TimePicker } from "@material-ui/pickers";
import { Add, Close, Save } from "@material-ui/icons";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import { useDrop } from "react-dnd";
import IFoodItem from "../item-builder/IFoodItem";
import FoodItem from "./FoodItem";
import { Menu, MenuObserver } from "./MenuObserver";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    heading: {
      fontSize: theme.typography.pxToRem(15),
      flexBasis: "33.33%",
      flexShrink: 0,
    },
    secondaryHeading: {
      fontSize: theme.typography.pxToRem(15),
      color: theme.palette.text.secondary,
      margin: "auto auto auto 0px",
    },
  })
);
const MenuAccordion: React.FC<{ menu: Menu; observer: MenuObserver }> = ({
  menu,
  observer,
}) => {
  const classes = useStyles();
  const [modalOpen, setModalOpen] = React.useState<boolean>(false);
  const [startTime, setStartTime] = React.useState<any>(new Date());
  const [endTime, setEndTime] = React.useState<any>(new Date());
  const [checked, setChecked] = React.useState<
    { ref: string; active: boolean }[]
  >([
    {
      ref: "Monday",
      active: false,
    },
    {
      ref: "Tuesday",
      active: false,
    },
    {
      ref: "Wednesday",
      active: false,
    },
    {
      ref: "Thursday",
      active: false,
    },
    {
      ref: "Friday",
      active: false,
    },
  ]);
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "food-item",
    drop: (e: IFoodItem) => observer.moveItemIntoGroup(e, menu.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  return (
    <div
      style={{
        border: "2px solid white",
        marginTop: 20,
        width: "95%",
        marginLeft: "1em",
      }}
    >
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        <Paper
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            padding: "2em",
          }}
        >
          <h3>Days to have menu active </h3>
          <FormGroup row>
            {checked.map((item) => (
              <FormControlLabel
                style={{ userSelect: "none" }}
                control={
                  <Checkbox
                    checked={item.active}
                    onChange={() => {
                      const newArray = checked.map((x) => {
                        if (x.ref === item.ref) {
                          x.active = !x.active;
                        }
                        return x;
                      });
                      setChecked(newArray);
                    }}
                    name={item.ref}
                    color="primary"
                  />
                }
                label={item.ref}
              />
            ))}
          </FormGroup>
          <FormGroup
            row
            style={{ display: "flex", justifyContent: "space-evenly" }}
          >
            <TimePicker
              label="Start time"
              value={startTime}
              onChange={setStartTime}
            />
            <TimePicker
              label="End time"
              value={endTime}
              onChange={setEndTime}
            />
          </FormGroup>
          <div style={{ display: "flex" }}>
            <Button
              onClick={() => setModalOpen(false)}
              style={{ margin: "20px auto auto 0px" }}
            >
              <Close style={{ marginRight: 5 }} /> Cancel
            </Button>
            <Button color="secondary" style={{ margin: "20px 0px auto auto" }}>
              <Save style={{ marginRight: 5 }} /> Save
            </Button>
          </div>
        </Paper>
      </Modal>
      <Accordion ref={drop}>
        <AccordionSummary
          expandIcon={isActive ? <Add /> : <ExpandMoreIcon />}
          aria-label="Expand"
          aria-controls="additional-actions1-content"
          id="additional-actions1-header"
        >
          <FormControlLabel
            aria-label="Acknowledge"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={
              <InputBase
                id={`accordion-name-${menu.id}`}
                aria-describedby="Item group name input"
                value={menu.name}
                style={{ paddingLeft: 10, width: "20ch" }}
                onChange={(e) => {
                  // observer.updateName(e.target.value, group.id);
                }}
              />
            }
            label=""
          />
          <Typography className={classes.secondaryHeading}>
            Serving: {menu.servingDays.reduce((p, c) => p + ", " + c)}
            {menu.servingTime && (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Menu times:
                {dateToHHMM(menu.servingTime)}
              </>
            )}
            {menu.items?.length !== 0 && (
              <>
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Items:&nbsp;{" "}
                {menu.items?.length}
              </>
            )}
          </Typography>
          <FormControlLabel
            style={{ margin: "auto 20px auto auto" }}
            aria-label="Acknowledge"
            onClick={(event) => event.stopPropagation()}
            onFocus={(event) => event.stopPropagation()}
            control={
              <Button onClick={(e) => setModalOpen(true)}>Edit Menu</Button>
            }
            label=""
          />
          {menu.isLive && (
            <FormControlLabel
              aria-label="Acknowledge"
              onClick={(event) => event.stopPropagation()}
              onFocus={(event) => event.stopPropagation()}
              control={
                <Button onClick={(e) => e.stopPropagation()}>
                  Disable Menu
                </Button>
              }
              label=""
            />
          )}
          {!menu.isLive && (
            <FormControlLabel
              aria-label="Acknowledge"
              onClick={(event) => event.stopPropagation()}
              onFocus={(event) => event.stopPropagation()}
              control={
                <Button onClick={(e) => e.stopPropagation()}>
                  Enable Menu
                </Button>
              }
              label=""
            />
          )}
        </AccordionSummary>
        <AccordionDetails>
          <div className="food-item-grid">
            {menu.items?.map((item) => (
              <FoodItem
                deletable
                item={item}
                onDelete={() => {
                  observer.removeFromMenu(item.id, menu.id);
                }}
              />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

const dateToHHMM = (date: Date): string =>
  `${
    date.getHours() < 10 ? "0" + date.getHours() : date.getHours().toString()
  } : ${
    date.getMinutes() < 10
      ? "0" + date.getMinutes()
      : date.getMinutes().toString()
  }`;
export default MenuAccordion;
