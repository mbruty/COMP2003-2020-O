import React from "react";
import AnimatedScroll from "../AnimatedCard/AnimatedScroll";

export interface Details {
  index: number;
  type: number;
  restaurantName: string;
  restaurantVisitDate: string;
}

interface Props {
  restaurantDetails: Array<Details>;
}

// Type is a number corresponding to the card style
// See resources/card(n).png
/*const cards = [
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
];*/

const cards = [];




/**
 * @param index The index of the card that has been swiped on
 */
const handleSwipe = (index: number) => {
  //What to do when the user swipes on that card
  alert("Swipe from " + index);
};

const RecentVisits: React.FC<Props> = (props) => {

  //Add visits to the card list
  var i = 0;
  while (i < 1){
  props.restaurantDetails.forEach(element => {
    cards.push({
      index: element.index, 
      type: element.type, name: 
      element.restaurantName, 
      visitDate: element.restaurantVisitDate})
    //Only display the 10 most recent visits
    if (cards.length > 10) {
      cards.pop();
    }
    i = i + 1;
  });
}

  return <AnimatedScroll handleSwipe={handleSwipe} cards={cards} />;
};

export default RecentVisits;
