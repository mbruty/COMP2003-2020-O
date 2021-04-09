import React from "react";

interface Props {
  columns: number;
  rows: number;
  index: number;
}

const NonDraggableWidget: React.FC<Props> = (props) => (
  <div
    className={`widget c${props.columns} r${props.rows}`}
    style={{
      animationDelay: props.index * 150 + "ms",
      padding: "1em",
      margin: 0,
    }}
  >
    {props.children}
  </div>
);

export default NonDraggableWidget;
