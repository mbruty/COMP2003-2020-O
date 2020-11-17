import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colorForBackground } from "react-native-redash";
import { CONSTANT_STYLES } from "./shared/constants";

interface Props {
  text: string;
  enabled: boolean;
}

export const AwsomeCardItem: React.FC<Props> = ({ text, enabled }) => {
  const image = enabled ? require("./heart.png") : require("./no-entry.png");
  const backgroundColour = enabled ? CONSTANT_STYLES.BG_RED : CONSTANT_STYLES.BG_BASE_COLOUR;
  

  return (
    <View style={[styles.infoBox]}>
      <View>
        <Image style={[styles.icon]} source={image} />
      </View>
      <Text style={[styles.infoText]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  },
  infoBox: {
    paddingLeft: 10,
    width: "100%",
    height: 55,
    flexDirection: "row",
  },
  icon: {
    borderRadius: 100,
    height: 50,
    width: 50,
    resizeMode: "stretch",
  },
  infoText: {
    fontSize: 15,
    paddingTop: 15,
    paddingLeft: 5,
  },
});
