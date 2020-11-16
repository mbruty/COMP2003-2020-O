import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
interface Props {
  text: string;
  index: number;
  iconName: string;
  enabled: boolean;
}

export const Icon: React.FC<Props> = (props) => {
  const iconColour = props.enabled ? "#FD4040" : "#707070";

  return (
    <View style={styles.container} key={`icon ${props.text}`}>
      <MaterialCommunityIcons
        name={props.iconName}
        size={35}
        color={iconColour}
      />
      <Text allowFontScaling={false} style={styles.txt}>
        {props.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  txt: {
    textAlign: "center",
  },
});
