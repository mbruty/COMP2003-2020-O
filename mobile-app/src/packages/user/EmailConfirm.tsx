import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { API_URL, CONSTANT_COLOURS, CONSTANT_STYLES } from "../../constants";
import { FormProgress } from "../controls";
import { includeAuth } from "../includeAuth";
import Banner from "./Banner";
interface Props {
  next: () => void;
}

const EmailConfirm: React.FC<Props> = (props) => {
  const dimensions = Dimensions.get("window");
  const imageHeight = Math.round((dimensions.width * 9) / 16);
  const imageWidth = dimensions.width;

  const secondRef = React.createRef<TextInput>();
  const thirdRef = React.createRef<TextInput>();
  const [statusText, setStatusText] = React.useState<string>("");

  const [errorText, setErrorText] = useState<string | undefined>();
  const [text, setText] = useState<Array<string>>(["", "", ""]);

  const submit = async() => {
    if (text[0].length !== 3 || text[1].length !== 3 || text[2].length !== 3) {
      setErrorText("Please enter a valid code");
      return
    }
    const auth = await includeAuth();
    const result = await fetch(API_URL + "/user/validatecode", {
      method: "POST",
      body: JSON.stringify({
        UserID: auth.userid,
        code: text.reduce((p, c) => p + c, "")
      })
    })
    console.log(result.status);
    
    if (result.status !== 200) {
      setErrorText("Incorrect Code");
      setText(["", "", ""]);
      setTimeout(() => setErrorText(undefined), 5000);
    } else {
      props.next();
    }
  };

  const onChangeText = (newText: string, index: number) => {
    const prevText = [...text];
    prevText[index] = newText;

    if (prevText[1].length === 3) {
      thirdRef.current.focus();
    } else if (prevText[0].length === 3) {
      secondRef.current.focus();
    } else if (prevText[2].length === 3) {
      if (errorText === "Please enter a valid code") {
        setErrorText(undefined);
      }
    }
    setText(prevText);
  };

  const inputStyles: Array<any> = [styles.textInput];
  if (errorText) {
    inputStyles.push(CONSTANT_STYLES.BG_ERR);
  }

  return (
    <ScrollView>
      <Banner />
      <Text
        allowFontScaling={false}
        style={[styles.bannerText, CONSTANT_STYLES.TXT_BASE]}
      >
        We've sent a code to your email
      </Text>
      <Text
        style={[
          CONSTANT_STYLES.TXT_DEFAULT,
          { marginTop: 60, marginLeft: 40, marginBottom: 15 },
        ]}
      >
        Code:
      </Text>
      <View style={styles.container}>
        <TextInput
          keyboardType={"number-pad"}
          allowFontScaling={false}
          style={inputStyles}
          maxLength={3}
          onChangeText={(e) => {
            onChangeText(e, 0);
          }}
          value={text[0]}
        />
        <View style={styles.line} />
        <TextInput
          keyboardType={"number-pad"}
          allowFontScaling={false}
          style={inputStyles}
          maxLength={3}
          ref={secondRef}
          onChangeText={(e) => {
            onChangeText(e, 1);
          }}
          value={text[1]}
        />
        <View style={styles.line} />
        <TextInput
          keyboardType={"number-pad"}
          allowFontScaling={false}
          style={inputStyles}
          maxLength={3}
          ref={thirdRef}
          onChangeText={(e) => {
            onChangeText(e, 2);
          }}
          value={text[2]}
        />
      </View>
      {errorText && (
        <Text style={[styles.errTxt, CONSTANT_STYLES.TXT_RED]}>
          {errorText}
        </Text>
      )}

      <TouchableOpacity
        style={{
          padding: 10,
          marginLeft: 25,
          borderRadius: 10,
          display: "flex",
          flexDirection: "row",
        }}
        onPress={async() => {
          const auth = await includeAuth();
          console.log((await fetch(API_URL + "/user/resendcode", {
            method: "POST",
            body: JSON.stringify(auth) 
          })).status);
          setStatusText("We've sent you a new code!")
          setTimeout(() => setStatusText(""), 5000)          
        }}
      >
        <Text
          style={{
            color: CONSTANT_COLOURS.DARK_GREY,
            marginRight: 5
          }}
        >
          Haven't recieved a code?
        </Text>
        <Text style={{ color: CONSTANT_COLOURS.RED }}>Resend Code</Text>
      </TouchableOpacity>
        {!!statusText && <Text style={{color: CONSTANT_COLOURS.DARK_GREY, marginLeft: 25}}>{statusText}</Text>}
      <View style={{ marginTop: 70 }}>
        <FormProgress onSubmit={submit} allowBack={false} selectedIdx={1} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  bannerText: {
    position: "absolute",
    top: 45,
    left: 15,
    fontSize: 30,
    fontWeight: "bold",
    elevation: 26,
  },
  textInput: {
    backgroundColor: "#FFF",
    height: 80,
    width: 80,
    borderColor: "#AAA",
    borderWidth: 1,
    borderRadius: 15,
    fontSize: 40,
    textAlign: "center",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
  },
  line: {
    backgroundColor: "#AAA",
    height: 4,
    width: 20,
    borderRadius: 5,
    alignSelf: "center",
    marginHorizontal: 5,
  },
  errTxt: {
    marginLeft: 50,
    marginTop: 5,
    fontSize: 15,
  },
});

export default EmailConfirm;
