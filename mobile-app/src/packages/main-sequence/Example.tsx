import React from "react";
import AnimatedScroll from "../AnimatedCard/AnimatedScroll";

// Type is a number corresponding to the card style
// See resources/card(n).png
const cards = [
  {
    index: 1,
    type: 0,
    name: "Big O Bois",
    visitDate: "09-12-20",
  },
  {
    index: 2,
    type: 1,
    name: "Big O Bois",
    visitDate: "09-12-20",
  },
  {
    index: 3,
    type: 0,
    name: "Big O Bois",
    visitDate: "09-12-20",
  },
  {
    index: 4,
    type: 1,
    name: "Big O Bois",
    visitDate: "09-12-20",
  },
  {
    index: 5,
    type: 0,
    name: "Big O Bois",
    visitDate: "09-12-20",
  },
  {
    index: 6,
    type: 1,
    name: "Big O Bois",
    visitDate: "09-12-20",
  },
  {
    index: 7,
    type: 0,
    name: "Big O Bois",
    visitDate: "09-12-20",
  },
  {
    index: 8,
    type: 1,
    name: "Big O Bois",
    visitDate: "09-12-20",
  },
  {
    index: 9,
    type: 0,
    name: "Big O Bois",
    visitDate: "09-12-20",
  },
];

/**
 * @param index The index of the card that has been swiped on
 */
const handleSwipe = (index: number) => {
  //What to do when the user swipes on that card
  alert("Swipe from " + index);
};

const Example: React.FC = (props) => {
  return <AnimatedScroll handleSwipe={handleSwipe} cards={cards} />;
};

export default Example;
