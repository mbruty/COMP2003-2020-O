import React from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { CircleBtn } from "./CircleBtn";
const { width } = Dimensions.get("screen");

interface Props {
  options: Array<string>;
  touchedArray: Array<boolean>;
  setTouched: (value: boolean, index: number) => void;
}

const CircleBtnView: React.FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      {props.options.map((option, index) => (
        <CircleBtn
          setTouched={props.setTouched}
          name={option}
          selected={props.touchedArray[index]}
          index={index}
          key={`circle-btn-${index}`}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: width > 380 ? "flex-start" : "space-evenly",
    paddingLeft: 20,
    paddingTop: 5,
    paddingBottom: 0,
  },
});

export default CircleBtnView;
