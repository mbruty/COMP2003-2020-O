import React from "react";
import { Widgets } from "../Home";
import DraggableWidget from "./DraggableWidget";
import IWidgetProps from "./IWidgetProps";
import NonDraggableWidget from "./NonDraggableWidget";

interface Props {
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  id: Widgets;
  editing: boolean;
  rows: number;
  columns: number;
}

const Widget: React.FC<Props> = (props) => {
  if (props.editing) {
    return <DraggableWidget {...props}>{props.children}</DraggableWidget>;
  }
  return <NonDraggableWidget {...props}>{props.children}</NonDraggableWidget>;
};

export default Widget;
