import React from "react";
import AnimatedScroll, { CardProps } from "../AnimatedCard/AnimatedScroll";

export interface Details {
  index: number;
  type: number;
  restaurantName: string;
  restaurantVisitDate: string;
}

interface Props {
  restaurants: Array<CardProps>;
}


/**
 * @param index The index of the card that has been swiped on
 */
const handleSwipe = (index: number) => {
  //What to do when the user swipes on that card
  alert("Swipe from " + index);
};

const RecentVisits: React.FC<Props> = ({restaurants}) => {
  // Select the 10 most recent cards
  // Possibly move this over to the api??
  const cards = restaurants.slice(0, restaurants.length > 10 ? 10 : restaurants.length);
  return <AnimatedScroll handleSwipe={handleSwipe} cards={cards} />;
};

export default RecentVisits;
