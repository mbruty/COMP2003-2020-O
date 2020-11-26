import React from "react";
import { View, StyleSheet } from "react-native";
import { Chip } from "./Chip";
interface Props {
  chipNameList: Array<string>;
  setTouched: (index: number) => void;
}
const ChipView: React.FC<Props> = (props) => {
  return (
    <View style={styles.container}>
      {props.chipNameList.map((chip, index) => (
        <Chip
          key={`chip-${index}`}
          title={chip}
          index={index}
          setTouched={props.setTouched}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    marginLeft: 20,
    flexWrap: "wrap",
    alignSelf: "flex-start",
    marginBottom: 30,
  },
});

export default ChipView;
