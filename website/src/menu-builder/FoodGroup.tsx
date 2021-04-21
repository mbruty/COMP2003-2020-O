import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  FormControlLabel,
  InputBase,
  TextField,
} from "@material-ui/core";
import { Add, Delete } from "@material-ui/icons";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import React from "react";
import { useDrop } from "react-dnd";
import { FoodGroup as FG, Observer } from "./FoodGridObserver";
import FoodItem from "./FoodItem";

const FoodGroup: React.FC<{ group: FG; observer: Observer }> = ({
  group,
  observer,
}) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: "food-item",
    drop: (e: any) => observer.moveItemIntoGroup(e.FoodID, group.id),
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
                id={`accordion-name-${group.id}`}
                aria-describedby="Item group name input"
                value={group.name}
                style={{ paddingLeft: 10, width: "31ch" }}
                onChange={(e) => {
                  if (group.name !== "Ungroupped") {
                    if (e.target.value === "Ungroupped")
                      alert(
                        'You cannot create a group with the reserved name "Ungroupped"'
                      );
                    else observer.updateName(e.target.value, group.id);
                  }
                }}
              />
            }
            label=""
          />
          {group.name !== "Ungroupped" && (
            <Delete
              onClick={() => {
                observer.removeGroup(group.id);
              }}
              style={{ margin: "auto 0 auto auto" }}
            />
          )}
        </AccordionSummary>
        <AccordionDetails>
          <div className="food-item-grid">
            {group.items?.map((item) => (
              <FoodItem item={item} />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default FoodGroup;
