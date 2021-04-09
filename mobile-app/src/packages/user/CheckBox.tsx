import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CONSTANT_COLOURS } from "../../constants";

const CheckBox: React.FC<{
  onPress: (name: string) => void;
  checked: boolean;
  text: string;
}> = (props) => (
  <TouchableOpacity
    onPress={() => props.onPress(props.text)}
    style={styles.container}
  >
    <Text style={styles.text}>{props.text}</Text>
    {props.checked ? (
      <AntDesign
        style={styles.icon}
        name="checksquareo"
        size={18}
        color={CONSTANT_COLOURS.RED}
      />
    ) : (
      <AntDesign
        style={styles.icon}
        name="closesquareo"
        size={18}
        color={CONSTANT_COLOURS.RED}
      />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "white",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    marginRight: 10,
  },
  text: {
    color: CONSTANT_COLOURS.DARK_GREY,
  },
  icon: {
    marginLeft: 10,
  },
});

export default CheckBox;
