import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { CONSTANT_STYLES } from "./shared/constants";

interface Props {
  selectedIdx: number;
  setPage: (index: number) => void;
}

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    width: width,
    borderBottomColor: "#AAAAAA",
    borderBottomWidth: 1,
    display: "flex",
    paddingTop: 40,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  image: {
    width: 40,
    height: 40,
  },
  touchable: {
    height: 50,
    width: 50,
    alignItems: "center",
  },
});

export const Nav: React.FC<Props> = (props) => {
  return (
    <View style={[CONSTANT_STYLES.BG_BASE_COLOUR, styles.container]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => props.setPage(0)}
      >
        <Image
          style={[styles.image, { marginTop: 8 }]}
          source={
            props.selectedIdx === 0
              ? require("./resources/solo-active.png")
              : require("./resources/solo-inactive.png")
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.setPage(1)}
        style={[
          styles.touchable,
          { width: 75, height: 75, marginTop: -3, marginBottom: -25 },
        ]}
      >
        <Image
          style={{ width: 60, height: 60 }}
          source={
            props.selectedIdx === 1
              ? require("./resources/group-active.png")
              : require("./resources/group-inactive.png")
          }
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.touchable, { marginTop: 4 }]}
        onPress={() => props.setPage(2)}
      >
        <Image
          style={styles.image}
          source={
            props.selectedIdx === 2
              ? require("./resources/settings-active.png")
              : require("./resources/settings-inactive.png")
          }
        />
      </TouchableOpacity>
    </View>
  );
};
