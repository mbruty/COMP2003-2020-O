import React from "react";
import { Item } from "../SwipeCard/SwipeCard";
import AnimatedSwipe from "../SwipeCard/AnimatedSwipe";
interface Props {}

const testItems: Array<Item> = [
  {
    enabled: true,
    text: "Has that food you like",
  },
  {
    enabled: true,
    text: "Nice guys",
  },
  {
    enabled: false,
    text: "10 miles away",
  },
];

const SoloPage: React.FC<Props> = (props) => {
  console.log("Hello from the swipe page");

  return <AnimatedSwipe />;
};

export default SoloPage;
