import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  ScrollView,
  Dimensions,
} from "react-native";
import { CONSTANT_COLOURS, CONSTANT_STYLES } from "../../constants";
import { AwsomeCardItem } from "./AwsomeCardItem";

export interface Item {
  text: string;
  enabled: boolean;
}

interface Props {
  items: Array<Item>;
  imageURI: string;
  title: string;
}

const { width, height } = Dimensions.get("screen");

export const CARD_WIDTH = Math.floor(width * 0.95);
export const CARD_HEIGHT = 480;

const SwipeCard: React.FC<Props> = (props) => {
  console.log(props.title);

  return (
    <View style={[styles.container]}>
      <View style={[styles.card]}>
        <Image style={[styles.image]} source={{ uri: props.imageURI }} />
        <Text style={styles.title}>{props.title}</Text>
        <View style={{ marginTop: 10 }}>
          {props.items.map((item) => (
            <AwsomeCardItem text={item.text} enabled={item.enabled} />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
    height: 300,
    resizeMode: "cover",
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 0,
    borderRadius: 20,
    alignSelf: "center",
  },
});

export default SwipeCard;
