import React from "react";
import { CONSTANT_STYLES } from '../../../shared/constants';
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  index: number;
  selected: boolean;
  setTouched: (value: boolean, index: number) => void;
}

export const CircleBtn: React.FC<Props> = (props) => {
  const buttonStyle: any = [styles.btn, CONSTANT_STYLES.BG_RED];
  // Set the button styles and image to match the selected state of the button
  buttonStyle.push(props.selected ? CONSTANT_STYLES.BG_RED : CONSTANT_STYLES.BG_WHITE);
  const image = props.selected
    ? require("./CircleBtn/heart.png")
    : require("../shared/baseline_not_interested_black_48.png");
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => props.setTouched(!props.selected, props.index)}
        style={buttonStyle}
      >
        <Image style={styles.icon} source={image}></Image>
      </TouchableOpacity>
      <Text allowFontScaling={false} style={[styles.text, CONSTANT_STYLES.TXT_DEFAULT]}>{props.name}</Text>
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
    elevation: 10
  },
  icon: {
    width: 32,
    height: 32,
    marginLeft: 14,
    marginTop: 14,
  },
  text: {
    textAlign: "center",
    marginTop: 5,
  },
});
