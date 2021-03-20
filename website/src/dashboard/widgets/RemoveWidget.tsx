import { AddBox, Delete } from "@material-ui/icons";
import React from "react";
import { useDrop } from "react-dnd";
import { WidgetType } from "../WidgetType";
import { Observer } from "../WidgetObserver";

const RemoveWidget: React.FC<{ observer: Observer }> = (props) => {
  const [{ canDrop, isOver }, drop] = useDrop(() => ({
    accept: WidgetType.WIDGET,
    drop: (e: any) => props.observer.removeWidget(e.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }));

  const isActive = canDrop && isOver;
  return (
    <div
      ref={drop}
      className={"widget c1 r1"}
      style={{
        display: "grid",
        padding: "1em",
        margin: 0,
        placeItems: "center",
        backgroundColor: isActive ? "rgba(0, 244, 144, 0.25)" : "",
      }}
    >
      <Delete style={{ fontSize: "4em" }} />
    </div>
  );
};

export default RemoveWidget;
