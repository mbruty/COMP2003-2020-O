import { AntDesign, Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { CONSTANT_COLOURS, CONSTANT_STYLES } from "../../constants";
import useToggle from "../../hooks/useToggle";
import AwesomeAutoCompleteInput from "../controls/AwesomeAutoCompleteInput";

interface Props {}

const values = ["Burger", "Beans", "Big Booty Bitches"];
let timeout;

const Preferences: React.FC<Props> = (props) => {
  const [value, setValue] = useState<string>("");

  const [showModal, toggleModal] = useToggle(false);

  const debounceInput = (text: string, delay: number = 500) => {
    clearTimeout(timeout);
    timeout = setTimeout(
      () =>
        // Make API Call here
        console.log(text),
      delay
    );
    setValue(text);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal animationType="fade" transparent={true} visible={showModal}>
        <TouchableWithoutFeedback onPress={toggleModal}>
          <View style={styles.centeredView}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalView}>
                <TouchableOpacity
                  onPress={toggleModal}
                  style={{
                    alignSelf: "flex-end",
                    marginTop: -15,
                  }}
                >
                  <AntDesign name="closecircleo" size={24} color="#AAA" />
                </TouchableOpacity>
                <Text style={{marginTop: -15}}>
                  We won't show you any reccomendations that contains these tags
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <AwesomeAutoCompleteInput
        autoComplete={values}
        value={value}
        setValue={debounceInput}
      />
      <Text style={[styles.txt, CONSTANT_STYLES.TXT_DEFAULT]}>
        I like to eat
      </Text>
      <View style={styles.seperator} />
      <View style={{ alignSelf: "flex-start" }}>
        <TouchableOpacity
          style={styles.txtContainer}
          onPress={() => toggleModal()}
        >
          <Text style={[styles.txt, CONSTANT_STYLES.TXT_DEFAULT]}>
            I don't like to eat
          </Text>
          <Ionicons
            name="ios-information-circle-outline"
            size={24}
            color={CONSTANT_COLOURS.DARK_GREY}
            style={{ paddingTop: 5, paddingLeft: 5 }}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    width: "80%",
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  txtContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    alignItems: "center",
  },
  txt: {
    paddingLeft: 25,
    paddingVertical: 15,
    fontSize: 18,
    alignSelf: "flex-start",
  },
  seperator: {
    width: "90%",
    borderColor: "#AAAAAA",
    borderWidth: 1,
    borderRadius: 5,
  },
});
export default Preferences;
