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
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Page } from "./GroupPageRouter";

interface Props {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
  isHost: boolean;
  roomCode: string;
  members: Array<String>;
}

const GroupWaitingRoom: React.FC<Props> = (props) => {
    if (props.isHost = true){
        return (
            <View>
                <View style={styles.box}>
                    <ScrollView>
                        <Text style={styles.title}>Room Code: {props.roomCode}</Text>
                        <View style={styles.spacer} />
                        <Text style={styles.title}>Group Members: </Text>
                        <Text style={styles.text}>{props.members[0]}</Text>
                        <Text style={styles.text}>{props.members[1]}</Text>
                        <Text style={styles.text}>{props.members[2]}</Text>
                    </ScrollView>
                </View>
            </View>
        );
    }

    if (props.isHost = false){
        return (
            <View>
                <View style={styles.box}>
                <ScrollView>
                        <Text style={styles.title}>Room Code: {props.roomCode}</Text>
                        <View style={styles.spacer} />
                        <Text style={styles.title}>Group Members: </Text>
                        <Text style={styles.text}>{props.members[0]}</Text>
                        <Text style={styles.text}>{props.members[1]}</Text>
                        <Text style={styles.text}>{props.members[2]}</Text>
                    </ScrollView>
                </View>
                <View style={styles.btnContainer}>
                    <TouchableOpacity
                        onPress={() => {
                        props.setPage(Page.map_view);
                        }}
                    >
                        <View style={[styles.btn]}>
                            <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                               START SWIPING
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
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
    height: "80%",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    borderRadius: 10,
    borderColor: "#AAAAAA",
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 10,
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

export default GroupWaitingRoom;
