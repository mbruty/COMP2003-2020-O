import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { CONSTANT_COLOURS, CONSTANT_STYLES, IMG_URL } from "../../constants";
import { AwsomeCardItem } from "./AwsomeCardItem";

export interface Item {
  text: string;
  enabled: boolean;
}

interface Props {
  foodID: number;
  title: string;
  price: number;
}

const { width, height } = Dimensions.get("screen");

export const CARD_WIDTH = Math.floor(width * 0.95);
export const CARD_HEIGHT = 480;

const SwipeCard: React.FC<Props> = (props) => {
  return (
    <View style={[styles.container]}>
      <View style={[styles.card]}>
        {/* Adding a meaningless query so we fetch the most up-to-date image */}
        <Image
          style={[styles.image]}
          source={{ uri: IMG_URL + props.foodID + ".png?1=1" }}
        />
        <View
          style={{
            position: "absolute",
            bottom: 50,
            padding: 5,
            borderRadius: 10,
            left: 15,
            borderColor: CONSTANT_COLOURS.DARK_GREY,
            borderWidth: 1,
            backgroundColor: "white",
          }}
        >
          <Text style={{ fontSize: 20, color: CONSTANT_COLOURS.DARK_GREY }}>
            £{props.price}
          </Text>
        </View>
        <Text style={styles.title}>{props.title}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
  title: {
    fontSize: 25,
    paddingTop: 5,
    textAlign: "center",
    color: CONSTANT_COLOURS.DARK_GREY,
  },
  card: {
    width: "95%",
    height: 520,
    borderRadius: 30,
    backgroundColor: "#FFF",
    borderColor: "#AAA",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 480,
    resizeMode: "cover",
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 0,
    borderRadius: 20,
    alignSelf: "center",
  },
});

export default SwipeCard;
