import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CircleBtnView } from "./Preferences/CircleBtnView";
import { ChipView } from "./Preferences/ChipView";

// ToDo: Fetch this list from the API?

const allergies = ["Lactose", "Nuts", "Gluten", "Soy", "Shellfish"];
const typesOfFood = ["Fish", "Vegan", "Vegetarian", "Meat", "Halal", "Kosher"];

interface Props {
  fName: string;
  setPage?: React.Dispatch<React.SetStateAction<string>>;
}

export const Preferences: React.FC<Props> = (props) => {
  const [allergiesBoolArr, setAllergiesBoolArr] = useState<Array<boolean>>(
    new Array<boolean>(allergies.length).fill(true)
  );

  const [foodBoolArr, setFoodBoolArr] = useState<Array<boolean>>(
    new Array<boolean>(allergies.length).fill(true)
  );

  const setAllergies = (touched: boolean, index: number) => {
    let enabled = [...allergiesBoolArr];
    enabled[index] = touched;
    setAllergiesBoolArr(enabled);
  };

  const setFoodTypes = (touched: boolean, index: number) => {
    let enabled = [...foodBoolArr];
    enabled[index] = touched;
    setFoodBoolArr(enabled);
  };

  const submit = () => {
    // ToDo:
    // Send preferences to the server...
    props.setPage("main");
  };

  const dimensions = Dimensions.get("window");
  const imageHeight = Math.round((dimensions.width * 9) / 16);
  const imageWidth = dimensions.width;
  return (
    <ScrollView>
      <View style={{ elevation: 25 }}>
        <Image
          style={{
            height: imageHeight,
            width: imageWidth,
          }}
          source={require("./Preferences/preferences_banner.png")}
        />
      </View>
      <Text allowFontScaling={false} style={styles.bannerText}>
        Hi {props.fName}!{"\n"}
        What types of food can you{"\n"}
        eat?
      </Text>
      <Text allowFontScaling={false} style={[styles.text, { marginTop: 10 }]}>
        {" "}
        Types of food
      </Text>
      <CircleBtnView
        options={typesOfFood}
        touchedArray={foodBoolArr}
        setTouched={setFoodTypes}
      />
      <Text allowFontScaling={false} style={styles.text}>
        Allergies / intolerance
      </Text>
      <ChipView
        enabledArray={allergiesBoolArr}
        setTouched={setAllergies}
        chipNameList={allergies}
      />
      <TouchableOpacity style={styles.submit} onPress={submit}>
        <View>
          <Text style={styles.submitText}>Submit</Text>
        </View>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    color: "#707070",
    margin: 15,
    marginTop: 0,
    fontSize: 25,
    fontWeight: "bold",
  },
  bannerText: {
    color: "#F1F1F1",
    position: "absolute",
    top: 50,
    left: 15,
    fontSize: 30,
    fontWeight: "bold",
    elevation: 26,
  },
  submit: {
    alignSelf: "flex-end",
    marginRight: 40,
    marginTop: 40
  },
  submitText: {
    color: "#FD4040",
    fontSize: 15,
    fontWeight: "bold",
  },
});
