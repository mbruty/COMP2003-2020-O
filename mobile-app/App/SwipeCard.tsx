import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { CONSTANT_STYLES } from "./shared/constants";

export interface Item {
  text: string;
  enabled: boolean;
}

interface Props {
  items: Array<Item>;
  title: string;
  imageURI: string;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
});

export const SwipeCard: React.FC<Props> = (props) => {
  return (
    <View
      style={[
        CONSTANT_STYLES.BG_BASE_COLOUR,
        styles.container,
        { paddingTop: 50 },
      ]}
    >
      <Image
        style={{ width: "100%", height: 200, resizeMode: "stretch" }}
        source={{ uri: props.imageURI }}
      />
      <Text>{props.title}</Text>
    </View>
  );
};
