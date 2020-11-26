import React, { useState } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { blue } from "react-native-redash";
import usePagination from "../../hooks/usePagination";
import Allergens from "./Allergens";
import Preferences from "./Preferences";

interface Props {
  showBack: boolean;
}
const { width } = Dimensions.get("screen");
const PreferencesController: React.FC<Props> = (props) => {
  const [page, increment, decrement] = usePagination(0);
  return (
    <View style={styles.container}>
      <View style={styles.nav}>
        <Text style={styles.navText}>Preferences</Text>
      </View>
      {page === 0 && <Allergens inc={increment} />}
      {page === 1 && <Preferences submit={() => null} showProgress={true} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  nav: {
    backgroundColor: "#fff",
    width: width,
    display: "flex",
    paddingTop: 35,
    borderBottomWidth: 1,
    borderBottomColor: "#AAAAAA",
  },
  navText: {
    textAlignVertical: "center",
    paddingVertical: 12,
    marginLeft: 50,
    fontSize: 25,
  },
});

export default PreferencesController;
