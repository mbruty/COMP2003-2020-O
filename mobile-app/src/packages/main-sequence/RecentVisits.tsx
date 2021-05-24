import React from "react";
import AnimatedScroll, { CardProps } from "../AnimatedCard/AnimatedScroll";
import RecentVisitDetails from "./RecentVisitDetails";

export interface Details {
  index: number;
  type: number;
  restaurantName: string;
  restaurantVisitDate: string;
}

interface Props {
  restaurants: Array<CardProps>;
}

const RecentVisits: React.FC<Props> = ({ restaurants }, { props }) => {
  const [selectedRestaurant, setSelectedRestaurant] =
    React.useState<number | undefined>();
  // Possibly move this over to the api??
  const cards = restaurants.slice(
    0,
    restaurants.length > 10 ? 10 : restaurants.length
  );
  const handleSwipe = (index: number) => {
    console.log(index);

    console.log("RESTUARANT", restaurants[index]);

    //What to do when the user swipes on that card
    setSelectedRestaurant(restaurants[index].id);
  };
  if (selectedRestaurant) {
    return (
      <RecentVisitDetails
        restaurantId={selectedRestaurant}
        rating={Math.floor(Math.random() * 5)}
        onClose={() => {
          setSelectedRestaurant(undefined);
        }}
      />
    );
  }
  return <AnimatedScroll handleSwipe={handleSwipe} cards={cards} />;
};

export default RecentVisits;
