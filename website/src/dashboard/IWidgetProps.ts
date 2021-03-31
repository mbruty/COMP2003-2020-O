import { Widgets } from "../Home";

export default interface IWidgetProps {
  index: number;
  moveWidget: (dragIndex: number, hoverIndex: number) => void;
  id: Widgets;
  editing: boolean;
}
