import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { blue } from "react-native-redash";
import { CONSTANT_COLOURS } from "../../constants";
import usePagination from "../../hooks/usePagination";
import { FormProgress } from "../controls";
import Allergens from "./Allergens";
import AutoComplete from "./AutoComplete";
import CheckBox from "./CheckBox";
import Preferences from "./Preferences";

interface Props {
  showBack: boolean;
}
const diets = ["Vegan", "Vegetarian", "Halal", "Kosher"];

const commonAllergens = [
  "Lactose Free",
  "Nut Free",
  "Egg Free",
  "Gluten Free",
  "Soy Free",
];
// Make it so the arrays cannot be changed
Object.freeze(diets);
Object.freeze(commonAllergens);

const { width } = Dimensions.get("screen");
const PreferencesController: React.FC<Props> = (props) => {
  const [allergies, setAllergies] = React.useState<
    Array<{ name: string; checked: boolean }>
  >(
    commonAllergens.map((x) => {
      return { name: x, checked: false };
    })
  );
  const [dietOptions, setDietOptions] = React.useState<
    Array<{ name: string; checked: boolean }>
  >(
    diets.map((x) => {
      return { name: x, checked: false };
    })
  );

  const handleAllergenPress = (name: string) => {
    setAllergies(
      allergies.map(allergy => {
        if (allergy.name !== name) return allergy;
        else {
          // flip the checked field
          return { ...allergy, checked: !allergy.checked };
        }
      })
    );
  };
  const handleDietPress = (name: string) => {
    setDietOptions(
      dietOptions.map(diet => {
        if (diet.name !== name) return diet;
        else {
          // flip the checked field
          return { ...diet, checked: !diet.checked };
        }
      })
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.navText}>Food Preferences</Text>
      </View>
      <View style={styles.content}>
        <AutoComplete />
        <Text style={styles.title}>Intolerances</Text>
        <Text style={styles.sub}>Tell us what food you can't eat</Text>
        <View style={styles.checkContainer}>
          {allergies.map((a) => (
            <CheckBox
              text={a.name}
              checked={a.checked}
              onPress={handleAllergenPress}
            />
          ))}
        </View>
        <View style={styles.spacer} />
        <Text style={styles.title}>Diets</Text>
        <Text style={styles.sub}>Tell us what food you can only eat</Text>
        <View style={styles.checkContainer}>
          {dietOptions.map((a) => (
            <CheckBox
              text={a.name}
              checked={a.checked}
              onPress={handleDietPress}
            />
          ))}
        </View>
      </View>
      <FormProgress onSubmit={() => {}} allowBack={false} selectedIdx={2} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
    width: "100%",
    display: "flex",
  },
  checkContainer: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
  },
  nav: {
    backgroundColor: "#fff",
    width: width,
    display: "flex",
    paddingTop: 35,
    marginBottom: 10,
  },
  navText: {
    textAlignVertical: "center",
    paddingVertical: 12,
    marginLeft: 50,
    fontSize: 25,
  },
  content: {},
  title: {
    marginLeft: 30,
    marginTop: 20,
    fontSize: 20,
    color: CONSTANT_COLOURS.RED,
    fontWeight: "bold",
  },
  sub: {
    marginLeft: 30,
    fontSize: 13,
    color: "#AAAAAA",
  },
  spacer: {
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    borderColor: "#CBCBCB",
    borderWidth: 1,
    borderRadius: 2,
    marginTop: 10,
  },
});

export default PreferencesController;
