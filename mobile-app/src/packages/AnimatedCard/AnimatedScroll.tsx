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
import GroupCard from "./GroupCard";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);
const useLazyRef = <T extends object>(initializer: () => T) => {
  const ref = useRef<T>();
  if (ref.current === undefined) {
    ref.current = initializer();
  }
  return ref.current;
};
interface Props {
  cards: Array<{
    index: number;
    type: number;
    name: string;
    visitDate: string;
  }>;
  handleSwipe: (index: number) => void;
}

const AnimatedScroll: React.FC<Props> = (props) => {
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
      data={props.cards}
      renderItem={({ index, item: { type } }) => (
        <GroupCard
          {...{ index, y, type }}
          name={props.cards[index].name}
          visitDate={props.cards[index].visitDate}
          onSwipe={props.handleSwipe}
        />
      )}
      keyExtractor={(item) => `${item.index}`}
    />
  );
};

export default AnimatedScroll;
