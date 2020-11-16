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
import { CONSTANT_STYLES } from "../../constants";
import { FormProgress } from "../controls";
import Banner from "../../resources/BannerSvg";
interface Props {
  next: () => void;
}

const EmailConfirm: React.FC<Props> = (props) => {
  const dimensions = Dimensions.get("window");
  const imageHeight = Math.round((dimensions.width * 9) / 16);
  const imageWidth = dimensions.width;

  const secondRef = React.createRef<TextInput>();
  const thirdRef = React.createRef<TextInput>();

  const [errorText, setErrorText] = useState<string | undefined>();
  const [text, setText] = useState<Array<string>>(["", "", ""]);

  const submit = () => {
    // ToDo: Check the server to see if the code is correct
    // Fake result
    let result = true;
    if (text[0].length !== 3 || text[1].length !== 3 || text[2].length !== 3) {
      setErrorText("Please enter a valid code");
    } else if (!result) {
      setErrorText("Incorrect Code");
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
        Code:{" "}
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
