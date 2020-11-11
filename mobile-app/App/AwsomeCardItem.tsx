import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { CONSTANT_STYLES } from "./shared/constants";

interface Props {
  text: string;
  enabled: boolean;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row"
  }
});
export const AwsomeCardItem: React.FC<Props> = ({ text, enabled }) => {
  const image = enabled ? require("heart icon") : require("no entry icon");
  const backgroundColour = enabled
    ? CONSTANT_STYLES.BG_RED
    : CONSTANT_STYLES.BG_BASE_COLOUR;

  return (
    <View>
      <View>
        <Image source={image} />
      </View>
      <Text>{text}</Text>
    </View>
  );
};
