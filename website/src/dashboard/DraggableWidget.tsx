import React, { FC, useRef } from "react";
import { XYCoord } from "dnd-core";
import { useDrag, useDrop, DropTargetMonitor } from "react-dnd";
import { WidgetType } from "./WidgetType";
import { Widgets } from "../Home";
import { DragIndicator } from "@material-ui/icons";

interface DragItem {
  index: number;
  id: Widgets;
  type: string;
}
interface Props {
  id: Widgets;
  rows: number;
  columns: number;
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
}

const DraggableWidget: React.FC<Props> = (props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [{ handlerId }, drop] = useDrop({
    accept: WidgetType.WIDGET,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor: DropTargetMonitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = props.index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      props.moveWidget(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: WidgetType.WIDGET,
    item: () => {
      return { id: props.id, index: props.index };
    },
    collect: (monitor: any) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const opacity = isDragging ? 0 : 1;
  drag(drop(ref));
  return (
    <div
      ref={ref}
      className={`widget c${props.columns} r${props.rows}`}
      style={{
        animationDelay: props.index * 150 + "ms",
        padding: "1em",
        margin: 0,
        opacity,
        cursor: "grab",
      }}
      data-handler-id={handlerId}
    >
      <DragIndicator style={{ position: "absolute", top: 20, right: 20 }} />

      {props.children}
    </div>
  );
};

export default DraggableWidget;
