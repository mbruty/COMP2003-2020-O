import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { Text, View, StyleSheet, TouchableOpacity, Image } from "react-native";
import { CONSTANT_COLOURS, CONSTANT_STYLES } from "../../constants";
interface Props {
  title: string;
  index: number;
  setTouched: (index: number) => void;
}

export const Chip: React.FC<Props> = (props) => {
  return (
    <TouchableOpacity
      style={{ height: 50 }}
      onPress={() => props.setTouched(props.index)}
    >
      <View style={[styles.container, CONSTANT_STYLES.BG_RED]}>
        <AntDesign name="closecircleo" size={24} color={"#FFF"} />
        <Text allowFontScaling={false} style={styles.txt}>
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
  txt: {
    marginTop: 2,
    paddingLeft: 5,
    color: "#FFF",
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 5,
  },
});
