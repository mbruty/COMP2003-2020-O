import React, { useState } from "react";
import {
  Alert,
  Button,
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
import { CONSTANT_STYLES } from "./shared/constants";
import { PasswordInput } from "./SignUpProcess/SignUp/PasswordInput";
import * as yup from "yup";
import { API_URL } from "./constants";

export interface SignIn {
  email: string;
  password: string;
  logInFailed?: boolean;
}
const dimensions = Dimensions.get("window");
const wHeight = dimensions.height;
const wWidth = dimensions.width;

const styles = StyleSheet.create({
  card: {
    marginTop: -450,
    padding: 50,
    borderRadius: 50,
    elevation: 5,
    width: wWidth,
    height: wHeight + 50,
  },
  image: {
    width: wWidth,
    height: wHeight / 2,
    marginBottom: wHeight / 2,
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
  submit: (token: string) => void;
  setPage: React.Dispatch<React.SetStateAction<string>>;
}

const email = yup.string().email().required();
export const LogIn: React.FC<Props> = ({ submit, setPage }) => {
  const [values, setValues] = useState<SignIn>({
    email: "",
    password: "",
  });
  const [validated, setValidated] = useState<SignIn>({
    email: "",
    password: "",
  });

  const validate = async () => {
    // Validate the fields before sending the request!

    if (values.email.trim() === "") {
      setValidated({ password: "", email: "Email cannot be empty" });
      return;
    } else if (values.password === "") {
      setValidated({ email: "", password: "Password cannot be empty" });
      return;
    } else {
      try {
        await email.validate(values.email);
      } catch (e) {
        setValidated({ password: "", email: "Please enter a valid email" });
        return;
      }
    }
    // Valid fields, let's try and log in
    fetch(API_URL + "/login", {
      method: "POST",
      headers: {
        email: values.email,
        password: values.password,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if (response.message === "Logged in") {
          // It was a valid log in! Send the event to the props!
          submit(response.authtoken);
        } else {
          // Failed log in, display an error

          setValidated({ email: "", password: "", logInFailed: true });
        }
      })
      .catch((e) => alert("There was an error signing in"));
  };

  return (
    <ScrollView contentContainerStyle={{flexGrow: 1}}>
      <Image style={styles.image} source={require("./log-in.png")} />

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
        <TouchableOpacity onPress={validate}>
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
    </ScrollView>
  );
};
