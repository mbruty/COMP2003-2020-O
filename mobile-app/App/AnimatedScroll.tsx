/* 
    Big thank you to William Candillon
    Who created the tutorial from which this was created
    Go watch it here
    https://youtu.be/NiFdK-s6OP8
    Original Source here
    https://github.com/wcandillon/can-it-be-done-in-react-native/blob/master/the-10-min/src/Wallet/WalletFlatList.tsx
*/

import React, { useRef } from "react";
import { Animated, FlatList } from "react-native";
import { Cards } from "./Card";
import GroupCard from "./GroupCard";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const useLazyRef = <T extends object>(initializer: () => T) => {
  const ref = useRef<T>();
  if (ref.current === undefined) {
    ref.current = initializer();
  }
  return ref.current;
};
const cards = [
  {
    index: 1,
    type: Cards.Card1,
  },
  {
    index: 2,
    type: Cards.Card2,
  },
  {
    index: 3,
    type: Cards.Card1,
  },
  {
    index: 4,
    type: Cards.Card2,
  },
  {
    index: 5,
    type: Cards.Card1,
  },
  {
    index: 6,
    type: Cards.Card2,
  },
  {
    index: 7,
    type: Cards.Card1,
  },
  {
    index: 8,
    type: Cards.Card2,
  },
];

const AnimatedScroll = () => {
  const y = useLazyRef(() => new Animated.Value(0));
  const onScroll = useLazyRef(() =>
    Animated.event(
      [
        {
          nativeEvent: {
            contentOffset: { y },
          },
        },
      ],
      { useNativeDriver: true }
    )
  );
  return (
    <AnimatedFlatList
      scrollEventThrottle={16}
      bounces={false}
      {...{ onScroll }}
      data={cards}
      renderItem={({ index, item: { type } }) => (
        <GroupCard {...{ index, y, type }} />
      )}
      keyExtractor={(item) => `${item.index}`}
    />
  );
};

export default AnimatedScroll;
