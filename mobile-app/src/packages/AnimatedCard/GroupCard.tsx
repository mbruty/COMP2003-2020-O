/* 
    Big thank you to William Candillon
    Who created the tutorial from which this was created
    Go watch it here
    https://youtu.be/NiFdK-s6OP8
    Original Source here
    https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/the-10-min/src/Wallet/WalletFlatList.tsx
*/

import React from "react";
import { Animated, Dimensions, StyleSheet, Text, View } from "react-native";
import AnimatedCard from "./AnimatedCard";
import { CARD_HEIGHT as DEFAULT_CARD_HEIGHT } from "./Card";
export const MARGIN = 16;
export const CARD_HEIGHT = DEFAULT_CARD_HEIGHT + MARGIN * 2;
const { height: wHeight, width: wWidth } = Dimensions.get("window");
const height = wHeight - 64;
const styles: any = StyleSheet.create({
  card: {
    marginVertical: MARGIN,
    alignSelf: "center",
    width: wWidth,
  },
});

interface GroupCardProps {
  y: Animated.Value;
  index: number;
  type: number;
  name: any;
  visitDate?: string;
  onSwipe: (index: number) => void;
}

const GroupCard = ({
  type,
  y,
  index,
  name,
  visitDate,
  onSwipe,
}: GroupCardProps) => {
  const position = Animated.subtract(index * CARD_HEIGHT, y);
  const isDisappearing = -CARD_HEIGHT;
  const isTop = 0;
  const isBottom = height - CARD_HEIGHT;
  const isAppearing = height;
  const translateY = Animated.add(
    Animated.add(
      y,
      y.interpolate({
        inputRange: [0, 0.00001 + index * CARD_HEIGHT],
        outputRange: [0, -index * CARD_HEIGHT],
        extrapolateRight: "clamp",
      })
    ),
    position.interpolate({
      inputRange: [isBottom, isAppearing],
      outputRange: [0, -CARD_HEIGHT / 4],
      extrapolate: "clamp",
    })
  );
  const scale = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
    extrapolate: "clamp",
  });
  const opacity = position.interpolate({
    inputRange: [isDisappearing, isTop, isBottom, isAppearing],
    outputRange: [0.5, 1, 1, 0.5],
  });

  return (
    <Animated.View
      style={[styles.card, { opacity, transform: [{ translateY }, { scale }] }]}
      key={index}
    >
      <AnimatedCard
        {...{ type }}
        name={name}
        nextVisit={visitDate}
        index={index}
        onSwipe={onSwipe}
      />
    </Animated.View>
  );
};

export default GroupCard;
