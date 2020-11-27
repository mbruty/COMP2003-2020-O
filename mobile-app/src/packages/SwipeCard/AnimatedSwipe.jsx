import React from "react";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";

import data from "./data";
import Swiper from "react-native-deck-swiper";
import { Transitioning, Transition } from "react-native-reanimated";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import SwipeCard from "./SwipeCard";
const { width } = Dimensions.get("window");

const stackSize = 4;
const colors = {
  red: "#EC2379",
  green: "#2fd86d",
  blue: "#0070FF",
  gray: "#777777",
  white: "#ffffff",
  black: "#000000",
};
const ANIMATION_DURATION = 200;

const transition = (
  <Transition.Sequence>
    <Transition.Out
      type="slide-bottom"
      durationMs={ANIMATION_DURATION}
      interpolation="easeIn"
    />
    <Transition.Together>
      <Transition.In
        type="fade"
        durationMs={ANIMATION_DURATION}
        delayMs={ANIMATION_DURATION / 2}
      />
      <Transition.In
        type="slide-bottom"
        durationMs={ANIMATION_DURATION}
        delayMs={ANIMATION_DURATION / 2}
        interpolation="easeOut"
      />
    </Transition.Together>
  </Transition.Sequence>
);

const swiperRef = React.createRef();
const transitionRef = React.createRef();

const Card = ({ card }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: card.image }} style={styles.cardImage} />
    </View>
  );
};

const CardDetails = ({ index }) => (
  <View key={data[index].id} style={{ alignItems: "center" }}>
    <Text style={[styles.text, styles.heading]} numberOfLines={2}>
      {data[index].name}
    </Text>
  </View>
);

export default function App() {
  const [index, setIndex] = React.useState(0);
  const onSwiped = () => {
    transitionRef.current.animateNextTransition();
    setIndex((index + 1) % data.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={data}
          cardIndex={index}
          renderCard={(card) => (
            <SwipeCard items={card.tags} imageURI={card.image} />
          )}
          backgroundColor={"transparent"}
          onSwiped={onSwiped}
          onTapCard={() => null}
          cardVerticalMargin={50}
          stackSize={stackSize}
          stackScale={10}
          stackSeparation={14}
          animateOverlayLabelsOpacity
          animateCardOpacity
          disableTopSwipe
          disableBottomSwipe
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: colors.red,
                  borderColor: colors.red,
                  color: colors.white,
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: -20,
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  backgroundColor: colors.blue,
                  borderColor: colors.blue,
                  color: colors.white,
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
          }}
        />
      </View>
      <View style={styles.bottomContainer}>
        <Transitioning.View
          ref={transitionRef}
          transition={transition}
          style={styles.bottomContainerMeta}
        >
          <CardDetails index={index} />
        </Transitioning.View>
        <View style={styles.bottomContainerButtons}>
          <MaterialCommunityIcons.Button
            name="close"
            size={50}
            backgroundColor="transparent"
            underlayColor="transparent"
            activeOpacity={0.3}
            color={colors.red}
            onPress={() => swiperRef.current.swipeLeft()}
          />
          <AntDesign.Button
            name="heart"
            size={35}
            style={{ marginTop: 8 }}
            backgroundColor="transparent"
            underlayColor="transparent"
            activeOpacity={0.3}
            color={colors.green}
            onPress={() => swiperRef.current.swipeRight()}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiperContainer: {
    flex: 1,
    marginTop: -30,
    zIndex: 2,
  },
  bottomContainer: {
    flex: 0.45,
    justifyContent: "flex-start",
  },
  bottomContainerMeta: { alignContent: "flex-end", alignItems: "center" },
  bottomContainerButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
  done: {
    textAlign: "center",
    fontSize: 30,
    color: colors.white,
    backgroundColor: "transparent",
  },
  heading: { fontSize: 24, marginBottom: 10, color: colors.gray },
  price: { color: colors.blue, fontSize: 32, fontWeight: "500" },
});
