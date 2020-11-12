import React, { useState } from "react";
import DatePicker from 'react-native-date-picker';
import {
  DatePickerAndroid, DatePickerIOS, DatePickerIOSComponent,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AwesomeTextInput } from "react-native-awesome-text-input";
import { CONSTANT_STYLES } from "../shared/constants";
import { PasswordInput } from "./SignUp/PasswordInput";
import { FormProgress } from "./shared/FormProgress";


interface Props {}
interface SignUp {
  nick: string;
  email: string;
  password: string;
}

export const SignUp: React.FC<Props> = (props) => {
  const dimensions = Dimensions.get("window");
  const imageHeight = Math.round((dimensions.width * 9) / 16);
  const imageWidth = dimensions.width;

  const [values, setValues] = useState<SignUp | undefined>();
  const [date, setDate] = useState(new Date());


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
        <AwesomeTextInput
          label="Email"
          customStyles={{
            title: CONSTANT_STYLES.TXT_DEFAULT,
            container: { marginTop: 5 },
          }}
          onChangeText={(text) => setValues({ ...values, email: text })}
        />
        <AwesomeTextInput
            label="Username"
            customStyles={{
              title: CONSTANT_STYLES.TXT_DEFAULT,
              container:{marginTop:25}
            }}
            onChangeText={(text) => setValues({...values, nick: text})}
        />

        <DatePicker date={date} onDateChange={setDate} />

        <PasswordInput
          label="Password"
          customStyles={{
            title: CONSTANT_STYLES.TXT_DEFAULT,
            container: { marginTop: 25 },
          }}
          onChangeText={(text) => setValues({ ...values, password: text })}
        />
        <PasswordInput
          label="Repeat Password"
          customStyles={{
            title: CONSTANT_STYLES.TXT_DEFAULT,
            container: { marginTop: 25 , marginBottom:25},
          }}
          onChangeText={() => {
            //ToDo: Validate password
          }}
        />
      </View>
      <FormProgress onNext={() => {}} allowBack={false} selectedIdx={0} />
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
});
