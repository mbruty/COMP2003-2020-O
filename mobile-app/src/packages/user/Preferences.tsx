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

const allergies = ["Lactose", "Nuts", "Gluten", "Soy", "Egg"];
const typesOfFood = ["Fish", "Vegan", "Vegetarian", "Meat", "Halal", "Kosher"];

interface Props {
  fName: string;
  setPage?: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
  authToken: string;
  userId: string;
}

// The react-native way of doing width: 100vw; height: 100vh;
const dimensions = Dimensions.get("window");
const imageHeight = Math.round((dimensions.width * 9) / 16);
const imageWidth = dimensions.width;

const Preferences: React.FC<Props> = (props) => {
  const [allergiesBoolArr, setAllergiesBoolArr] = useState<Array<boolean>>(
    new Array<boolean>(allergies.length).fill(true)
  );

  const [foodBoolArr, setFoodBoolArr] = useState<Array<boolean>>(
    new Array<boolean>(typesOfFood.length).fill(true)
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

  // Same as above, but for food types
  const setFoodTypes = (touched: boolean, index: number) => {
    let enabled = [...foodBoolArr];
    enabled[index] = touched;
    setFoodBoolArr(enabled);
  };

  const submit = async () => {
    try {
      await submitPreferences(
        {
          food: foodBoolArr,
          allergies: allergiesBoolArr,
        },
        props.userId,
        props.authToken
      );
      props.onSubmit();
    } catch (e) {
      console.log(e);
    }
  };

  const textStyle = [styles.text, CONSTANT_STYLES.TXT_DEFAULT];
  return (
    <ScrollView>
      <View style={{ elevation: 25 }}>
        <Banner />
      </View>
      <Text
        allowFontScaling={false}
        style={[styles.bannerText, CONSTANT_STYLES.TXT_BASE]}
      >
        Hi {props.fName},{"\n"}
        what types of food can you{"\n"}
        eat?
      </Text>
      <Text
        allowFontScaling={false}
        style={[textStyle, { marginTop: 0, marginBottom: 0 }]}
      >
        Types of food
      </Text>
      <CircleBtnView
        options={typesOfFood}
        touchedArray={foodBoolArr}
        setTouched={setFoodTypes}
      />
      <Text allowFontScaling={false} style={[textStyle, { marginTop: 15 }]}>
        Allergies / intolerance
      </Text>
      <ChipView
        enabledArray={allergiesBoolArr}
        setTouched={setAllergies}
        chipNameList={allergies}
      />
      <FormProgress onSubmit={submit} allowBack={false} selectedIdx={2} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  text: {
    margin: 15,
    marginTop: 0,
    fontSize: 25,
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

export default Preferences;
