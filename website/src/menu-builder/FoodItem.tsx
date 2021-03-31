import { Paper } from "@material-ui/core";
import {
  DeleteForever,
  DragIndicator,
  Edit,
  Fastfood,
} from "@material-ui/icons";
import React from "react";
import { useDrag } from "react-dnd";
import { useHistory } from "react-router";
import IFoodItem from "../item-builder/IFoodItem";

const FoodItem: React.FC<{
  item: IFoodItem;
  deletable?: boolean;
  onDelete?: () => void;
}> = ({ item, deletable, onDelete }) => {
  const history = useHistory();
  const [imgError, setImgError] = React.useState<boolean>(false);
  const [{ isDragging }, drag] = useDrag({
    type: "food-item",
    item: () => {
      return { ...item };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const onError = () => {
    setImgError(true);
  };
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
      {imgError ? (
        <Fastfood style={{ fontSize: 150 }} />
      ) : (
        <img
          src={`https://storage.googleapis.com/tat-img/${item.id}.png`}
          alt={`${item.shortName}`}
          style={{ marginTop: "10px", pointerEvents: "none" }}
          width="120px"
          onError={onError}
        />
      )}
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
      <Edit
        onClick={() => history.push(`/item-builder/${item.id}`)}
        style={{ position: "absolute", top: 35, right: 5, cursor: "pointer" }}
      />
      {deletable && (
        <DeleteForever
          style={{
            position: "absolute",
            top: 65,
            right: 5,
            color: "firebrick",
            cursor: "pointer",
          }}
          onClick={onDelete}
        />
      )}
    </Paper>
  );
};

export default FoodItem;
