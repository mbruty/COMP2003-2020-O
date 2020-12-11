import React from "react";
import { Dimensions, Image, StyleSheet, Text } from "react-native";
import { CONSTANT_STYLES } from "../../constants";

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
      source = require("../../resources/card0.png");
      break;
    case 1:
      source = require("../../resources/card1.png");
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
          { top: 75, left: 25, fontSize: 16, fontWeight: "normal" },
        ]}
      >
        {"Date of Visit: " + nextVisit}
      </Text>
      <Text
        style={[
          styles.titleTxt,
          CONSTANT_STYLES.TXT_BASE,
          { top: 120, left: 25, fontSize: 16, fontWeight: "normal" },
        ]}
      >
        {"Swipe for more info ---->"}
      </Text>
    </>
  );
};
