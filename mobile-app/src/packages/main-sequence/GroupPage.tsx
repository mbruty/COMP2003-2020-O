import React from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CONSTANT_STYLES, CONSTANT_COLOURS } from "../../constants";
import { AwesomeTextInput } from "react-native-awesome-text-input";
import { GroupObserver } from "./GroupObserver";

interface Props {
  observer: GroupObserver;
  onJoin: (code: string) => void;
  error: string;
}

const GroupPage: React.FC<Props> = (props) => {
  const [code, setCode] = React.useState("");
  return (
    <View>
      <View style={styles.box}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={styles.title}>Enter a Group Code:</Text>
        </View>
        <AwesomeTextInput
          value={code}
          onChangeText={(text) => setCode(text)}
          keyboardType="number-pad"
          customStyles={{
            title: CONSTANT_STYLES.TXT_DEFAULT,
            container: { marginTop: 25 },
          }}
          label="Group Code"
        />
        {props.error !== "" && (
          <Text
            style={{
              paddingTop: 5,
              marginLeft: 5,
              paddingRight: 10,
              color: "#8c1c1c",
            }}
          >
            {props.error}
          </Text>
        )}
        <View style={styles.btnContainer}>
          <TouchableOpacity
            onPress={() => {
              props.onJoin(code);
            }}
          >
            <View style={[styles.btn]}>
              <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                JOIN GROUP
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.spacerContainer}>
        <View style={styles.spacer1} />
        <Text style={styles.text}>OR</Text>
        <View style={styles.spacer1} />
      </View>

      <View style={styles.btnContainer}>
        <TouchableOpacity
          onPress={() => {
            props.observer.showMapView();
          }}
        >
          <View style={[styles.btn]}>
            <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
              CREATE A GROUP
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

export default GroupPage;
