import React, { useState } from "react";
import DatePicker from "@react-native-community/datetimepicker";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AwesomeTextInput } from "react-native-awesome-text-input";
import { CONSTANT_STYLES } from "../shared/constants";
import { PasswordInput } from "./SignUp/PasswordInput";
import { FormProgress } from "./shared/FormProgress";
import * as yup from "yup";
import { TouchableOpacity } from "react-native";
import { API_URL } from "../constants";

const isToday = (someDate): boolean => {
  const today = new Date();
  return (
    someDate.getDate() == today.getDate() &&
    someDate.getMonth() == today.getMonth() &&
    someDate.getFullYear() == today.getFullYear()
  );
};

const email = yup.string().email().required();
interface Values {
  username: string;
  email: string;
  dob: Date | string;
  password: string;
  confPassword: string;
}

interface Props {
  next: (value: string, userid: string, authtoken: string) => void;
}

export const SignUp: React.FC<Props> = (props) => {
  const dimensions = Dimensions.get("window");
  const imageHeight = Math.round((dimensions.width * 9) / 16);
  const imageWidth = dimensions.width;

  const [values, setValues] = useState<Values>({
    username: "",
    email: "",
    dob: "",
    password: "",
    confPassword: "",
  });
  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [errors, setErrors] = useState<Values>({
    username: "",
    email: "",
    dob: "",
    password: "",
    confPassword: "",
  });

  const validate = async () => {
    let hasErrors = false;
    let currentErrors: Values = {
      username: "",
      email: "",
      dob: "",
      password: "",
      confPassword: "",
    };
    try {
      await email.validate(values.email);
    } catch (e) {
      currentErrors.email = "Please enter a valid email";
      hasErrors = true;
    }
    if (values.username.length === 0) {
      currentErrors.username = "Username is required";
      hasErrors = true;
    }
    if (values.email.length === 0) {
      currentErrors.email = "Email is required";
      hasErrors = true;
    }
    if (
      values.password !== values.confPassword ||
      values.password.length === 0
    ) {
      currentErrors.confPassword = "The passwords do not match";
      hasErrors = true;
    }
    if (isToday(date)) {
      currentErrors.dob = "Date of Birth is required";
      hasErrors = true;
    }
    if (!hasErrors) {
      // Try and post the sign-up info
      fetch(API_URL + "/signup", {
        method: "POST",
        headers: {
          email: values.email,
          password: values.password,
          yearOfBirth: date.getFullYear().toString(),
          nickname: values.username,
        },
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.error === "Email is in use") {
            // The email is already in use
            currentErrors.email = "Email is in use";
          } else if (response.message === "Signed Up") {
            // Go to the next bit
            props.next(values.username, response.userid, response.authtoken);
          } else {
            console.log(response);

            alert("An unexpected error has happened");
          }
        })
        .catch((e) => alert("There was an error signing in"));
    }
    setErrors(currentErrors);
  };

  let dateText = isToday(date) ? "Date Of Birth" : date.toDateString();

  return (
    <ScrollView>
      <Image
        style={{
          height: imageHeight,
          width: imageWidth,
          marginTop: -15,
        }}
        source={require("./shared/preferences_banner.png")}
      />
      <Text
        allowFontScaling={false}
        style={[styles.bannerText, CONSTANT_STYLES.TXT_BASE]}
      >
        {"Hello,\nLet's get your account \nset-up"}
      </Text>
      <View style={[styles.txtContainer, { width: imageWidth - 100 }]}>
        <KeyboardAvoidingView>
          <AwesomeTextInput
            label="Username"
            customStyles={{
              title: CONSTANT_STYLES.TXT_DEFAULT,
            }}
            onChangeText={(text) => setValues({ ...values, username: text })}
          />
        </KeyboardAvoidingView>
        {errors.username !== "" && (
          <Text style={[CONSTANT_STYLES.TXT_RED, styles.errTxt]}>
            {errors.username}
          </Text>
        )}
        <KeyboardAvoidingView>
          <AwesomeTextInput
            label="Email"
            customStyles={{
              title: CONSTANT_STYLES.TXT_DEFAULT,
              container: { marginTop: 25 },
            }}
            keyboardType="email-address"
            onChangeText={(text) => setValues({ ...values, email: text })}
          />
        </KeyboardAvoidingView>
        {errors.email !== "" && (
          <Text style={[CONSTANT_STYLES.TXT_RED, styles.errTxt]}>
            {errors.email}
          </Text>
        )}

        <KeyboardAvoidingView>
          <PasswordInput
            label="Password"
            customStyles={{
              title: CONSTANT_STYLES.TXT_DEFAULT,
              container: { marginTop: 25 },
            }}
            onChangeText={(text) => setValues({ ...values, password: text })}
          />
        </KeyboardAvoidingView>
        <KeyboardAvoidingView>
          <PasswordInput
            label="Repeat Password"
            customStyles={{
              title: CONSTANT_STYLES.TXT_DEFAULT,
              container: { marginTop: 25, marginBottom: 25 },
            }}
            onChangeText={(text) =>
              setValues({ ...values, confPassword: text })
            }
          />
        </KeyboardAvoidingView>
        {errors.confPassword !== "" && (
          <Text
            style={[
              CONSTANT_STYLES.TXT_RED,
              styles.errTxt,
              { marginTop: -10, marginBottom: 10 },
            ]}
          >
            {errors.confPassword}
          </Text>
        )}
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowDatePicker(true)}
        >
          <Text
            style={[
              CONSTANT_STYLES.TXT_DEFAULT,
              { fontSize: 18, marginLeft: 5, marginTop: 15, paddingLeft: 5 },
            ]}
          >
            {dateText}
          </Text>
        </TouchableOpacity>
        {errors.dob !== "" && (
          <Text
            style={[CONSTANT_STYLES.TXT_RED, styles.errTxt, { marginTop: 15 }]}
          >
            {errors.dob}
          </Text>
        )}
        {showDatePicker && (
          <DatePicker
            onChange={(_, selectedDate) => {
              if (Platform.OS === "android") {
                setShowDatePicker(false);
              }
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
            value={date}
            mode="date"
            display="spinner"
            maximumDate={new Date()}
          />
        )}
      </View>
      <FormProgress
        onSubmit={() => {
          console.log("Here");

          validate();
        }}
        allowBack={false}
        selectedIdx={0}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bannerText: {
    position: "absolute",
    top: 35,
    left: 15,
    fontSize: 25,
    fontWeight: "bold",
    elevation: 26,
  },
  txtContainer: {
    flex: 1,
    alignSelf: "center",
  },
  dateInput: {
    width: "98%",
    height: 50,
    borderBottomColor: "#c4c4c4",
    borderRadius: 5,
    borderBottomWidth: 1,
  },
  errTxt: {
    marginLeft: 5,
    marginTop: 5,
    marginBottom: -25,
    fontSize: 13,
  },
});
