import React from "react";
import {
  Alert,
  Button,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { CustomTextInput } from "./Login/CustomTextInput";
import { CONSTANT_STYLES } from "./constants";

interface Props {}

export const LogIn: React.FC<Props> = (props) => {
  // @ts-ignore
  const dimensions = Dimensions.get("window");
  const imageHeight = dimensions.height / 2;
  const imageWidth = dimensions.width;

  return (
    <ScrollView style={{ overflow: "hidden" }}>
      <Image
        style={{
          width: imageWidth,
          height: imageHeight,
          marginBottom: imageHeight,
        }}
        source={require("./log-in.png")}
      />

      <View style={[styles.card, CONSTANT_STYLES.BG_BASE_COLOUR]}>
        <Text style={[styles.titleText, CONSTANT_STYLES.TXT_RED]}>
          Track and Taste
        </Text>

        <CustomTextInput label="Email" isPassword={false} />
        <CustomTextInput label="Password" isPassword={true} />

        <TouchableOpacity>
          <Text
            style={[
              styles.highlightTxt,
              CONSTANT_STYLES.TXT_RED,
              { textAlign: "right" },
            ]}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <View style={[styles.btn, CONSTANT_STYLES.BG_RED]}>
            <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
              LOG IN
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.txtContainer}>
          <Text style={CONSTANT_STYLES.TXT_DEFAULT}>
            Don't have an account?
          </Text>
          <Text style={CONSTANT_STYLES.TXT_RED}>
            {" "}
            Sign Up
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 200,
    padding: 50,
    borderRadius: 50,
    elevation: 5,
    paddingBottom: 500,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 24,
    paddingBottom: 20,
    paddingTop: 10,
    textAlign: "center",
  },
  highlightTxt: {
    fontSize: 14,
    paddingBottom: 15,
  },
  btn: {
    paddingHorizontal: 0,
    paddingVertical: 15,
    borderRadius: 50,
  },
  btnTxt: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  txtContainer: {
    flex:1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25
  }
});
