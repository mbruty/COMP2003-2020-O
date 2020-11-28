import React from "react";
import { Dimensions, Image, StyleSheet } from "react-native";

const Banner: React.FC = (props) => {
  return (
    <Image
      source={require("../../resources/preferences_banner.png")}
      style={styles.banner}
    />
  );
};

const { width, height } = Dimensions.get("screen");

const styles = StyleSheet.create({
  banner: {
    width: width,
    height: Math.round((width * 9) / 16),
    marginTop: -20,
  },
});

export default Banner;
