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
} from "react-native";
import { CONSTANT_STYLES, CONSTANT_COLOURS } from "../../constants";
import { AwesomeTextInput } from "react-native-awesome-text-input";
import { reset } from "../includeAuth";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

interface Props {
  logOut: () => void;
}

const Group: React.FC<Props> = (props) => {
  return (
      <View style={styles.box}>
          <View style={styles.spacer} />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>Enter a Group Code:</Text>
          </View>
          <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="Group Code"
            />
            <View style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Join Group Clicked");
                  }}
                >
                  <View style={[styles.btn]}>
                    <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                      JOIN GROUP
                    </Text>
                  </View>
                </TouchableOpacity>
            </View>

            <Text style={styles.text}>---------or---------</Text>

            <View style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={() => {
                    console.log("Create Group Clicked");
                  }}
                >
                  <View style={[styles.btn]}>
                    <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                      CREATE GROUP
                    </Text>
                  </View>
                </TouchableOpacity>
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
    backgroundColor: "#369aff",
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
});

export default Group;
