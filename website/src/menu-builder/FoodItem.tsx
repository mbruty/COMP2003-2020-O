import { Paper } from "@material-ui/core";
import { DragIndicator } from "@material-ui/icons";
import React from "react";
import { useDrag } from "react-dnd";
import IFoodItem from "../item-builder/IFoodItem";

const FoodItem: React.FC<{ item: IFoodItem }> = ({ item }) => {
  const [{ isDragging }, drag] = useDrag({
    type: "food-item",
    item: () => {
      return { id: item.id };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });
  return (
    <Paper
      ref={drag}
      elevation={5}
      style={{
        display: "grid",
        placeItems: "center",
        width: "200px",
        position: "relative",
        cursor: "grab",
      }}
    >
      <img
        src={`https://storage.googleapis.com/tat-img/${item.id}.png`}
        alt={`${item.shortName}`}
        style={{ marginTop: "10px", pointerEvents: "none" }}
        width="120px"
      />
      <div
        style={{
          display: "flex",
          flexFlow: "row",
          justifyContent: "space-evenly",
          width: "100%",
        }}
      >
        <p>{item.shortName}</p>
        <p>{item.price}</p>
      </div>
      <DragIndicator style={{ position: "absolute", top: 5, right: 5 }} />
    </Paper>
  );
};

export default FoodItem;
