import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { CONSTANT_STYLES } from "../../shared/constants";

interface Props {
  title: string;
  index: number;
  enabled: boolean;
  setTouched: (touched: boolean, index: number) => void;
}

export const Chip: React.FC<Props> = (props) => {
  const viewStyles: Array<any> = [styles.container];

  // Add disabled / enabled colour to the view styles
  viewStyles.push(
    props.enabled ? CONSTANT_STYLES.BG_RED : CONSTANT_STYLES.BG_WHITE
  );

  const textStyle = props.enabled ? [styles.textActive, CONSTANT_STYLES.TXT_WHITE] : [styles.textDisabled, CONSTANT_STYLES.TXT_DEFAULT];

  // Set the icon to the enabled / disabled one
  const icon = props.enabled
    ? require("./Chip/baseline_check_circle_outline_white_18.png")
    : require("../shared/baseline_not_interested_black_48.png");
  return (
    <TouchableOpacity
      style={{ height: 50 }}
      onPress={() => props.setTouched(!props.enabled, props.index)}
    >
      <View style={viewStyles}>
        <Image style={styles.icon} source={icon}></Image>
        <Text allowFontScaling={false} style={textStyle}>
          {props.title}
        </Text>
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
    elevation: 10,
  },
  textActive: {
    marginTop: 2,
    paddingLeft: 5,
  },
  textDisabled: {
    marginTop: 2,
    paddingLeft: 5,
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 5,
  },
});
