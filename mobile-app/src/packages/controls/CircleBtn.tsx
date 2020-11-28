import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { CONSTANT_STYLES } from "../../constants";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
interface Props {
  name: string;
  index: number;
  selected: boolean;
  setTouched: (value: boolean, index: number) => void;
}

export const CircleBtn: React.FC<Props> = (props) => {
  const buttonStyle: any = [styles.btn, CONSTANT_STYLES.BG_RED];
  // Set the button styles and image to match the selected state of the button
  buttonStyle.push(
    props.selected ? CONSTANT_STYLES.BG_RED : CONSTANT_STYLES.BG_WHITE
  );
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => props.setTouched(!props.selected, props.index)}
        style={buttonStyle}
      >
        {props.selected && (
          <MaterialCommunityIcons
            style={styles.icon}
            name="heart"
            color="white"
            size={32}
          />
        )}
        {!props.selected && (
          <MaterialIcons
            style={styles.icon}
            name="not-interested"
            color="#707070"
            size={32}
          />
        )}
      </TouchableOpacity>
      <Text
        allowFontScaling={false}
        style={[styles.text, CONSTANT_STYLES.TXT_DEFAULT]}
      >
        {props.name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    marginRight: 10,
    marginTop: 20,
  },
  btn: {
    borderRadius: 100,
    width: 60,
    height: 60,
    alignSelf: "center",
    elevation: 10,
  },
  icon: {
    marginLeft: 14,
    marginTop: 14,
  },
  text: {
    textAlign: "center",
    marginTop: 5,
  },
});
