import React, { useState, Component }from "react";
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
  BackHandler,
} from "react-native";
import { CONSTANT_STYLES, CONSTANT_COLOURS, IMG_URL } from "../../constants";
import { AwesomeTextInput } from "react-native-awesome-text-input";
import { reset } from "../includeAuth";
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { Rating } from 'react-native-ratings';
import TapRating from "react-native-ratings/dist/TapRating";

interface Props {
    onBack?: () => void;
    restaurantID: number;
    rating: number;
    restaurantName: string;
    dateOfVisit: string;
}

const RecentVisitDetails: React.FC<Props> = (props) => {

  function ratingCompleted(newRating){
    console.log("New rating is: " + newRating);
    //Update rating in datbase here
  }

  React.useEffect(() => {
    const backAction = () => {
        props.onBack();
      return true;
    };
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);

  return (
    <View>
      <View style={styles.box}>
      <TouchableOpacity style={{
            backgroundColor: "#c2c2c2",
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
          <Image style={[styles.image]} source={{ uri: IMG_URL + props.restaurantID + ".png" }}/>
          {/*Not sure if we're storing restaurant photos*/}
        <Text style={[styles.title]}>{props.restaurantName}</Text>
        <Text>{props.dateOfVisit}</Text>
        <View style={styles.box}>
        <Text>A bit of info about the restaurant, will this be stored in the database? 
            Maybe some info about the exact menu item that was selected for you.</Text>
        </View>
        <TapRating 
        showRating
        defaultRating={props.rating}
        onFinishRating={ratingCompleted}
        />
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
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 0,
    borderRadius: 20,
    alignSelf: "center",
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
    color: CONSTANT_COLOURS.RED,
    fontSize: 18,
  },
});

export default RecentVisitDetails;
