import React from "react";
import { Dimensions, Image, StyleSheet, Text } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, { Value } from "react-native-reanimated";
import { CONSTANT_STYLES } from "../../shared/constants";

const { width } = Dimensions.get("window");
const ratio = 228 / 362;
export const CARD_WIDTH = width * 0.8;
export const CARD_HEIGHT = CARD_WIDTH * ratio;

const styles: any = StyleSheet.create({
  card: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
  },
  titleTxt: {
    position: "absolute",
    fontSize: 20,
    fontWeight: "bold",
    textShadowColor: "#000000",
    textShadowOffset: { height: 1 },
    textShadowRadius: 5,
    padding: 2,
  },
});

export enum Cards {
  Card1,
  Card2,
}

interface CardProps {
  type: number;
  name: string;
  nextVisit: string;
}

export default ({ type, name, nextVisit }: CardProps) => {
  let source: number;
  switch (type) {
    case 0:
      source = require("../AnimatedScroll/Card/card1.png");
      break;
    case 1:
      source = require("../AnimatedScroll/Card/card2.png");
      break;
    default:
      throw Error("Invalid card style");
  }

  return (
    <>
      <Image style={styles.card} {...{ source }} />
      <Text
        style={[
          styles.titleTxt,
          CONSTANT_STYLES.TXT_BASE,
          { top: 25, left: 25 },
        ]}
      >
        {name}
      </Text>
      <Text
        style={[
          styles.titleTxt,
          CONSTANT_STYLES.TXT_BASE,
          { top: 120, left: 25, fontSize: 16, fontWeight: "normal" },
        ]}
      >
        {"Next Visit: " + nextVisit}
      </Text>
    </>
  );
};
