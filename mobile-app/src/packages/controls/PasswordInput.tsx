import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { AwesomeTextInput } from "react-native-awesome-text-input";
import { CONSTANT_COLOURS, CONSTANT_STYLES } from "../../constants";

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
        {showText ? (
          <MaterialIcons
            name="visibility"
            size={24}
            color={CONSTANT_COLOURS.DARK_GREY}
          />
        ) : (
          <MaterialIcons
            name="visibility-off"
            size={24}
            color={CONSTANT_COLOURS.DARK_GREY}
          />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PasswordInput;
