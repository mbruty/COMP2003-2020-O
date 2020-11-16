import React, { useState } from "react";
import {
  Image,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { AwesomeTextInput } from "react-native-awesome-text-input";
import Visability from "../../resources/icons/visability";
import VisabilityOff from "../../resources/icons/visabilityOff";

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
  const image = showText ? <Visability /> : <VisabilityOff />;

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
        {() => image}
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
