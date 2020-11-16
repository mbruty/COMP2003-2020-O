import React, { useState } from "react";
import {
  Image,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { AwesomeTextInput } from "react-native-awesome-text-input";

interface StyleStructure {
  container: ViewStyle;
  title: TextStyle;
  inputContainer: ViewStyle;
}

interface Props {
  label: string;
  customStyles: Partial<StyleStructure>;
  onChangeText: (text: string) => void;
}

const PasswordInput: React.FC<Props> = (props) => {
  const [showText, setShowText] = useState<boolean>(false);
  const image = showText
    ? require("./PasswordInput/dont_show_pass.png")
    : require("./PasswordInput/show_pass.png");

  return (
    <View>
      <AwesomeTextInput
        label={props.label}
        secureTextEntry={!showText}
        customStyles={props.customStyles}
        onChangeText={props.onChangeText}
      />
      <TouchableOpacity
        style={{ position: "absolute", top: 38, right: 25 }}
        onPress={() => setShowText(!showText)}
      >
        <Image source={image} style={{ width: 25, height: 25 }} />
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
