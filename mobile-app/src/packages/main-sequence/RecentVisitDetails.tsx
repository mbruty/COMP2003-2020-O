import React, { useState } from "react";
import {
  Text,
  View,
  Button,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { CONSTANT_STYLES, CONSTANT_COLOURS, IMG_URL } from "../../constants";
import { AwesomeTextInput } from "react-native-awesome-text-input";
import { reset } from "../includeAuth";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface Props {
    onBack?: () => void;
    restaurantID: number;
}

const RecentVisitDetails: React.FC<Props> = (props) => {
  return (
    <View>
      <View style={styles.box}>
      <TouchableOpacity style={{
            backgroundColor: "grey",
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 100,
            marginBottom: 15,
            width: 45,
          }}
            onPress={() => {
                props.onBack();
            }}>
            <MaterialCommunityIcons name="keyboard-backspace" size={24} color="black" />
          </TouchableOpacity>
          <ScrollView>
          <View style={[styles.image]}></View>
        <Text style={[styles.title]}>Restaurant Name</Text>
        <Text>Date of Visit</Text>
        <View style={styles.box}>
        <Text>A bit of info about the restaurant, will this be stored in the database? 
            Maybe some info about the exact menu item that was selected for you.</Text>
        </View>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
  card: {
    width: "95%",
    height: 520,
    borderRadius: 30,
    backgroundColor: "#FFF",
    borderColor: "#AAA",
    borderWidth: 1,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 0,
    borderRadius: 20,
    alignSelf: "center",
    backgroundColor: "#c2c2c2"
  },
  filledContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "rgba(255,255,255,255)",
    width: "100%",
    paddingTop: 15,
    paddingBottom: 50,
    marginTop: "75%",
    paddingHorizontal: 50,
    borderRadius: 50,
    borderColor: "#aaaaaa",
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center",
    color: CONSTANT_COLOURS.DARK_GREY,
  },
  btn: {
    marginTop: 5,
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: CONSTANT_COLOURS.RED,
  },
  btnTxt: {
    textAlign: "center",
    fontSize: 16,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "75%",
    alignSelf: "center",
    paddingTop: 5,
  },
  box: {
    backgroundColor: "white",
    width: "95%",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    borderRadius: 10,
    borderColor: "#AAAAAA",
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 15,
  },
  title: {
    fontWeight: "bold",
    marginTop: 15,
    color: CONSTANT_COLOURS.DARK_GREY,
    fontSize: 18,
  },
  danger: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center",
    color: CONSTANT_COLOURS.RED,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  spacer: {
    width: "100%",
    marginTop: 20,
    height: 1,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 2,
  },
  spacerContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingLeft: 10,
    marginBottom: 15,
  },
  spacer1: {
    width: "45%",
    marginTop: 17,
    height: 1,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 2,
  },
});

export default RecentVisitDetails;
