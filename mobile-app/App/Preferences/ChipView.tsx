import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { Chip } from "./ChipView/Chip";
interface Props {
  chipNameList: Array<string>;
}
export const ChipView: React.FC<Props> = (props) => {
  const [enabledArray, setEnabledArray] = useState<Array<boolean>>(
    new Array<boolean>(props.chipNameList.length).fill(true)
  );
  const setTouched = (touched: boolean, index: number) => {
    let enabled = [...enabledArray];
    enabled[index] = touched;
    setEnabledArray(enabled);
  };
  return (
    <View style={styles.container}>
      {props.chipNameList.map((chip, index) => (
        <Chip
          title={chip}
          enabled={enabledArray[index]}
          index={index}
          setTouched={setTouched}
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
    flexWrap: "wrap"
  }
})
