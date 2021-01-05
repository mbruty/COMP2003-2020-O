import React from "react";
import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
} from "react-native";
import { CONSTANT_STYLES } from "../../constants";
import { FontAwesome, FontAwesome5, Fontisto } from "@expo/vector-icons";

interface Props {
  selectedIdx: number;
  setPage: (index: number) => void;
}

const inactive = require("../../resources/recent_inactive.png");
const active = require("../../resources/recent_active.png");

const { width } = Dimensions.get("screen");

const styles = StyleSheet.create({
  container: {
    width: width,
    borderBottomColor: "#AAAAAA",
    borderBottomWidth: 1,
    display: "flex",
    paddingTop: 50,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  touchable: {
    height: 50,
    width: 50,
    alignItems: "center",
  },
});

const Nav: React.FC<Props> = (props) => {
  const image = props.selectedIdx === 2 ? active : inactive;
  return (
    <View style={[CONSTANT_STYLES.BG_BASE_COLOUR, styles.container]}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => props.setPage(0)}
      >
        <FontAwesome5
          name="user-ninja"
          size={30}
          color={props.selectedIdx === 0 ? "#FD4040" : "#707070"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => props.setPage(1)}
        style={[styles.touchable]}
      >
        <FontAwesome
          name="group"
          size={30}
          color={props.selectedIdx === 1 ? "#FD4040" : "#707070"}
        />
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.touchable}
        onPress={() => props.setPage(2)}
      >
        <Image source={image} style={{ height: 30, width: 30 }} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.touchable, { marginTop: 4 }]}
        onPress={() => props.setPage(3)}
      >
        <Fontisto
          name="player-settings"
          size={30}
          color={props.selectedIdx === 3 ? "#FD4040" : "#707070"}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Nav;
