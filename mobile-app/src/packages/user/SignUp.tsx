import React, { useMemo, useState } from "react";
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
import { TouchableOpacity } from "react-native";
import { CONSTANT_STYLES } from "../../constants";
import { isToday, Values } from "./utils";
import validate, { Params } from "./ValidateSignUp";
import { FormProgress, PasswordInput } from "../controls";
import Banner from "./Banner";
import { Ionicons } from "@expo/vector-icons";
import useDebouncer from "../../hooks/useDebouncer";

interface Props {
  next: (value: string, userid: string, authtoken: string) => void;
  close: () => void;
}

const { width } = Dimensions.get("window");

const SignUp: React.FC<Props> = ({ next, close }) => {
  const [values, setValues] = useState<Values>({
    username: "",
    email: "",
    dob: "",
    password: "",
    confPassword: "",
  });

  const isIos = Platform.OS === "ios";

  const [date, setDate] = useState<Date>(new Date());
  const [showDatePicker, setShowDatePicker] = useState<boolean>(isIos);
  const [errors, setErrors] = useState<Values>({
    username: "",
    email: "",
    dob: "",
    password: "",
    confPassword: "",
  });
  let debounceValidate = useMemo(
    () => (debounceValidate = useDebouncer<Params>(validate, 1500)),
    []
  );
  useMemo(() => debounceValidate({ values, date, next, setErrors }), [values]);

  let dateText = isToday(date) ? "Date Of Birth" : date.toDateString();

  return (
    <View style={{ height: Dimensions.get("screen").height }}>
      <TouchableOpacity
        style={{
          position: "absolute",
          top: 50,
          right: 30,
          zIndex: 2,
          opacity: 0.5,
        }}
        onPress={() => {
          close();
        }}
      >
        <Ionicons name="ios-close-circle-outline" size={32} color="black" />
      </TouchableOpacity>
      <Banner />
      <Text
        allowFontScaling={false}
        style={[styles.bannerText, CONSTANT_STYLES.TXT_BASE]}
      >
        {"Hello,\nLet's get your account \nset-up"}
      </Text>
      <View style={[styles.txtContainer, { width: width - 100 }]}>
        <KeyboardAvoidingView>
          <AwesomeTextInput
            label="Nickname"
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
        {!isIos && (
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
        )}
        {isIos && (
          <Text
            style={[
              CONSTANT_STYLES.TXT_DEFAULT,
              { fontSize: 18, marginLeft: 5, marginTop: 15, paddingLeft: 5 },
            ]}
          >
            {dateText}
          </Text>
        )}
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
          validate({ values, date, setErrors, submit: true, next: next });
        }}
        allowBack={false}
        selectedIdx={0}
      />
    </View>
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

export default SignUp;
