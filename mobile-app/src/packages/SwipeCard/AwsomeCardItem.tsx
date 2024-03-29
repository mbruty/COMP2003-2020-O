import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { CONSTANT_COLOURS, CONSTANT_STYLES } from "../../constants";

interface Props {
  text: string;
  enabled: boolean;
}

export const AwsomeCardItem: React.FC<Props> = ({ text, enabled }) => {
  return (
    <View style={[styles.infoBox]}>
      <View>
        {enabled && (
          <View style={[styles.circle, CONSTANT_STYLES.BG_RED]}>
            <AntDesign
              name="heart"
              style={{ alignSelf: "center" }}
              size={24}
              color="#FFF"
            />
          </View>
        )}
        {!enabled && (
          <View>
            <MaterialIcons
              name="not-interested"
              size={24}
              color={CONSTANT_COLOURS.DARK_GREY}
            />
          </View>
        )}
      </View>
      <Text style={[styles.infoText]}>{text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
  },
  infoBox: {
    paddingLeft: 10,
    width: "100%",
    height: 55,
    flexDirection: "row",
  },
  icon: {
    borderRadius: 100,
    height: 50,
    width: 50,
    resizeMode: "stretch",
  },
  infoText: {
    fontSize: 15,
    paddingLeft: 10,
    paddingTop: 10,
  },
  circle: {
    width: 40,
    height: 40,
    borderRadius: 50,
    justifyContent: "center",
  },
});
