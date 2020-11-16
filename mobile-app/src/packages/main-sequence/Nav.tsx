import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { CONSTANT_STYLES } from "../../constants";
import Settings from "../../resources/icons/settings";
import Solo from "../../resources/icons/solo";
import Group from "../../resources/icons/group";

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
        <Solo />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.setPage(1)}
        style={[
          styles.touchable,
          { width: 75, height: 75, marginTop: -3, marginBottom: -25 },
        ]}
      >
        <Group />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.touchable, { marginTop: 4 }]}
        onPress={() => props.setPage(2)}
      >
        <Settings />
      </TouchableOpacity>
    </View>
  );
};
