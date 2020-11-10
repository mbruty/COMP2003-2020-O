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
import { loginState } from "./SignUpProcess/IUser";
import { PasswordInput } from "./SignUpProcess/SignUp/PasswordInput";

export interface SignIn {
  email: string;
  password: string;
}
const dimensions = Dimensions.get("window");
const wHeight = dimensions.height;
const wWidth = dimensions.width;

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    top: 200,
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
  submit: (values: SignIn) => void;
  loginState: loginState;
}

export const LogIn: React.FC<Props> = ({ submit, loginState }) => {
  const [values, setValues] = useState<SignIn | undefined>();
  const [validated, setValidated] = useState();

  return (
    <ScrollView style={{ overflow: "hidden" }}>
      <Image style={styles.image} source={require("./log-in.png")} />

      <KeyboardAvoidingView style={[styles.card, CONSTANT_STYLES.BG_BASE_COLOUR]}>
        <Text style={[styles.titleText, CONSTANT_STYLES.TXT_RED]}>
          Track and Taste
        </Text>

        <AwesomeTextInput
          keyboardType="email-address"
          customStyles={{
            title: CONSTANT_STYLES.TXT_DEFAULT,
            container: { marginTop: 25 },
          }}
          onChangeText={(text) => setValues({ ...values, email: text })}
          label="Email"
        />
        <PasswordInput
          label="Password"
          customStyles={{
            title: CONSTANT_STYLES.TXT_DEFAULT,
            container: { marginTop: 25 },
          }}
          onChangeText={(text) => setValues({ ...values, password: text })}
        />
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
            submit(values);
          }}
        >
          <View style={[styles.btn, CONSTANT_STYLES.BG_RED]}>
            <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
              LOG IN
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.txtContainer}>
          <Text style={[CONSTANT_STYLES.TXT_DEFAULT]}>
            Don't have an account?
          </Text>
          <Text style={CONSTANT_STYLES.TXT_RED}> Sign Up</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};
