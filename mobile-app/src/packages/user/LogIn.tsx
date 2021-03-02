import React, { useState } from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { AwesomeTextInput } from "react-native-awesome-text-input";
import { CONSTANT_STYLES } from "../../constants";
import { PasswordInput } from "../controls";
import { SignIn } from "./utils";
import validate from "./ValidateLogin";
import LogInSvg from "../../resources/LogInSvg";

const dimensions = Dimensions.get("window");
const wHeight = dimensions.height;
const wWidth = dimensions.width;

const styles = StyleSheet.create({
  card: {
    marginTop: -wHeight * 0.7,
    padding: 50,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    elevation: 5,
    width: wWidth,
    height: wHeight * 0.8,
  },
  image: {
    width: wWidth,
    height: wHeight / 2,
    marginBottom: wHeight / 2,
    marginLeft: -43,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 24,
    paddingBottom: 10,
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
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
});

interface Props {
  submit: () => void;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const LogIn: React.FC<Props> = ({ submit, setPage }) => {
  const [values, setValues] = useState<SignIn>({
    email: "",
    password: "",
  });
  const [validated, setValidated] = useState<SignIn>({
    email: "",
    password: "",
  });

  return (
    <View style={{ width: wWidth, height: wHeight }}>
      <LogInSvg style={styles.image} />
      <KeyboardAvoidingView
        style={[styles.card, CONSTANT_STYLES.BG_BASE_COLOUR]}
      >
        <Text style={[styles.titleText, CONSTANT_STYLES.TXT_RED]}>
          Track and Taste
        </Text>

        {validated.logInFailed && (
          <Text
            style={[
              CONSTANT_STYLES.TXT_RED,
              {
                fontWeight: "bold",
                textAlign: "center",
                fontSize: 16,
                paddingTop: 10,
              },
            ]}
          >
            Invalid Login
          </Text>
        )}
        <AwesomeTextInput
          autoCapitalize="none"
          keyboardType="email-address"
          customStyles={{
            title: CONSTANT_STYLES.TXT_DEFAULT,
            container: { marginTop: 25 },
          }}
          onChangeText={(text) => setValues({ ...values, email: text })}
          label="Email"
        />
        <Text style={CONSTANT_STYLES.TXT_RED}>{validated.email}</Text>
        <PasswordInput
          label="Password"
          customStyles={{
            title: CONSTANT_STYLES.TXT_DEFAULT,
            container: { marginTop: 25 },
          }}
          onChangeText={(text) => setValues({ ...values, password: text })}
        />
        <Text style={CONSTANT_STYLES.TXT_RED}>{validated.password}</Text>
        <TouchableOpacity>
          <Text
            style={[
              styles.highlightTxt,
              CONSTANT_STYLES.TXT_RED,
              { textAlign: "right", marginTop: 10 },
            ]}
          >
            Forgot Password?
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            validate(values, submit).then((errors) => {
              if (errors) {
                setValidated(errors);
              }
            });
          }}
        >
          <View style={[styles.btn, CONSTANT_STYLES.BG_RED]}>
            <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
              LOG IN
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.txtContainer}
          onPress={() => setPage("sign-up")}
        >
          <Text style={[CONSTANT_STYLES.TXT_DEFAULT]}>
            Don't have an account?
          </Text>
          <Text style={CONSTANT_STYLES.TXT_RED}> Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LogIn;
