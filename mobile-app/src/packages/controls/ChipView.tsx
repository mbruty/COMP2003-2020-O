import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip } from "./Chip";
interface Props {
  chipNameList: Array<string>;
  enabledArray: Array<boolean>;
  setTouched: (touched: boolean, index: number) => void;
}
const ChipView: React.FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      {props.chipNameList.map((chip, index) => (
        <Chip
          key={`chip-${index}`}
          title={chip}
          enabled={props.enabledArray[index]}
          index={index}
          setTouched={props.setTouched}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 20,
    flexWrap: "wrap",
  },
});

export default ChipView;
