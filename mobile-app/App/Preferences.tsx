import React from "react";
import { Dimensions, Image, StyleSheet, Text, TextInput, View } from "react-native";
import { ChipView } from "./Preferences/ChipView";

// ToDo: Fetch this list from the API?

const allergies = ["Lactose", "Nuts", "Gluten", "Soy", "Shellfish"];

interface Props {
  fName: string;
}

export const Preferences: React.FC<Props> = (props) => {
  const dimensions = Dimensions.get("window");
  const imageHeight = Math.round((dimensions.width * 9) / 16);
  const imageWidth = dimensions.width;
  return (
    <View>
      <View style={{ elevation: 25 }}>
        <Image
          style={{
            height: imageHeight,
            width: imageWidth,
          }}
          source={require("../resources/icons/preferences_banner.png")}
        />
      </View>
      <Text style={styles.bannerText}>
        Hi {props.fName}!{"\n"}
        What types of food can you{"\n"}
        eat?
      </Text>
      <Text style={styles.text}> Types of food</Text>
      <Text style={styles.text}>Allergies / intolerance</Text>
      <ChipView chipNameList={allergies} />
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#707070",
    margin: 15,
    fontSize: 20,
  },
  bannerText: {
    color: "#F1F1F1",
    position: "absolute",
    top: 50,
    left: 15,
    fontSize: 30,
    elevation: 26
  },
});
