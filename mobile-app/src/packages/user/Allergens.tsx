import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CONSTANT_STYLES } from "../../constants";
import { ChipView, CircleBtnView, FormProgress } from "../controls";
import { submitPreferences } from "./submitPreferences";
import Banner from "./Banner";

// ToDo: Fetch this list from the API?

const allergies = [
  "Lactose Free",
  "Nut Free",
  "Gluten Free",
  "Soy Free",
  "Egg Free",
  "Vegan",
  "Vegetarian",
  "Halal",
  "Kosher",
];
const typesOfFood = ["Fish", "Vegan", "Vegetarian", "Meat", "Halal", "Kosher"];

interface Props {}

// The react-native way of doing width: 100vw; height: 100vh;
const dimensions = Dimensions.get("window");

const Allergens: React.FC<Props> = (props) => {
  const [allergiesBoolArr, setAllergiesBoolArr] = useState<Array<boolean>>(
    new Array<boolean>(allergies.length).fill(false)
  );

  /* Set the allergies array to the value at the index
    This will be used by the chips to update the state of the form on
    a touch event from a chip 
  */
  const setAllergies = (touched: boolean, index: number) => {
    let enabled = [...allergiesBoolArr];
    enabled[index] = touched;
    setAllergiesBoolArr(enabled);
  };

  const textStyle = [styles.text, CONSTANT_STYLES.TXT_DEFAULT];
  return (
    <ScrollView style={{ marginTop: 25 }}>
      <Text
        allowFontScaling={false}
        style={[textStyle, { marginTop: 0, marginBottom: 0 }]}
      >
        I can only eat
      </Text>
      <CircleBtnView
        options={allergies}
        touchedArray={allergiesBoolArr}
        setTouched={setAllergies}
      />
      <FormProgress onSubmit={() => null} allowBack={false} selectedIdx={2} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 15,
    marginTop: 0,
    fontSize: 20,
    fontWeight: "bold",
  },
  bannerText: {
    position: "absolute",
    top: 35,
    left: 15,
    fontSize: 30,
    fontWeight: "bold",
    elevation: 26,
  },
  submit: {
    alignSelf: "flex-end",
    marginRight: 40,
    marginTop: 40,
  },
  submitText: {
    fontSize: 15,
    fontWeight: "bold",
  },
});

export default Allergens;
