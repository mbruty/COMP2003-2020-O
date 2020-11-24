import React from "react";
import AnimatedScroll from "../AnimatedCard/AnimatedScroll";

// Type is a number corresponding to the card style
// See resources/card(n).png
const cards = [
  {
    index: 1,
    type: 0,
    name: "Restaurant 1",
    visitDate: "09-12-20",
  },
  {
    index: 2,
    type: 1,
    name: "Restaurant 2",
    visitDate: "09-12-20",
  },
  {
    index: 3,
    type: 0,
    name: "Restaurant 3",
    visitDate: "09-12-20",
  },
  {
    index: 4,
    type: 1,
    name: "Restaurant 4",
    visitDate: "09-12-20",
  },
  {
    index: 5,
    type: 0,
    name: "Restaurant 5",
    visitDate: "09-12-20",
  },
  {
    index: 6,
    type: 1,
    name: "Restaurant 6",
    visitDate: "09-12-20",
  },
  {
    index: 7,
    type: 0,
    name: "Restaurant 7",
    visitDate: "09-12-20",
  },
  {
    index: 8,
    type: 1,
    name: "Restaurant 8",
    visitDate: "09-12-20",
  },
  {
    index: 9,
    type: 0,
    name: "Restaurant 9",
    visitDate: "09-12-20",
  },
];

//New visits can be added to the list like this
cards.push({index: 10, type: 1, name: "Restaurant 10", visitDate: "09-12-20"})


/**
 * @param index The index of the card that has been swiped on
 */
const handleSwipe = (index: number) => {
  //What to do when the user swipes on that card
  alert("Swipe from " + index);
};

const RecentVisits: React.FC = (props) => {
  //console.log("Hello");

  return <AnimatedScroll handleSwipe={handleSwipe} cards={cards} />;
};

export default RecentVisits;
