import React, { Dispatch, SetStateAction } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";

interface Props {
  title: string;
  index: number;
  enabled: boolean;
  setTouched: (touched: boolean, index: number) => void;
}

export const Chip: React.FC<Props> = (props) => {
  const viewStyles: Array<any> = [styles.container];

  viewStyles.push(props.enabled ? styles.active : styles.inactive);

  const textStyle = props.enabled ? styles.textActive : styles.textDisabled;

  const icon = props.enabled
    ? require("../../../resources/icons/heart.png")
    : require("../../../resources/icons/baseline_not_interested_black_48.png");
  return (
    <TouchableOpacity
      style={{ height: 50 }}
      onPress={() => props.setTouched(!props.enabled, props.index)}
    >
      <View style={viewStyles}>
        <Image style={styles.icon} source={icon}></Image>
        <Text style={textStyle}>{props.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 5,
    padding: 8,
    paddingRight: 15,
    borderRadius: 20,
    flex: 1,
    flexDirection: "row",
    elevation:10,
  },
  active: {
    backgroundColor: "#FD4040",
  },
  inactive: {
    backgroundColor: "#FFF",
  },
  textActive: {
    marginTop: 2,
    paddingLeft: 5,
    color: "#FFF",
  },
  textDisabled: {
    marginTop: 2,
    paddingLeft: 5,
    color: "#707070",
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 5,
  },
});
