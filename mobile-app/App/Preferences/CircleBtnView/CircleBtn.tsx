import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface Props {
  name: string;
  index: number;
  selected: boolean;
  setTouched: (value: boolean, index: number) => void;
}

export const CircleBtn: React.FC<Props> = (props) => {
  const buttonStyle: any = [styles.btn];
  // Set the button styles and image to match the selected state of the button
  buttonStyle.push(props.selected ? styles.selected : styles.deselected);
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
      <Text allowFontScaling={false} style={styles.text}>{props.name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 80,
    marginRight: 10,
    marginTop: 20,
  },
  selected: {
    backgroundColor: "#FD4040",
  },
  deselected: {
    backgroundColor: "#FFF",
  },
  btn: {
    backgroundColor: "#FD4040",
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
    color: '#707070'
  },
});
