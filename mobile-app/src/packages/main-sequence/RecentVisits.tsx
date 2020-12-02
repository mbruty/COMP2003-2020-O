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
  if (props.restaurantDetails.length > 0){
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
  }
  return <AnimatedScroll handleSwipe={handleSwipe} cards={cards} />;
};

export default RecentVisits;
