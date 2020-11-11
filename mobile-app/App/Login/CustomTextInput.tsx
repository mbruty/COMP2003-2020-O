import React, { useState } from "react";
import { Dimensions, Image, TouchableOpacity, View } from "react-native";
import { AwesomeTextInput } from "react-native-awesome-text-input";

interface Props {
  isPassword: boolean;
  label: string;
}

export const CustomTextInput: React.FC<Props> = ({ isPassword, label }) => {
  // The react-native way of doing width: 100vw; height: 100vh;
  const dimensions = Dimensions.get("window");
  const imageWidth = dimensions.width;
  const [showPass, setShowPass] = useState<boolean | undefined>(isPassword);
  const image = showPass
    ? require("./CustomTextInput/baseline_visibility_black_36.png")
    : require("./CustomTextInput/baseline_visibility_off_black_36.png");
  return (
    <View style={{ width: imageWidth - 100, marginBottom: 20 }}>
      <AwesomeTextInput keyboardType="email-address" label={label} secureTextEntry={showPass} />
      {isPassword && (
        <TouchableOpacity
          style={{ position: "absolute", right: 5, top: 10 }}
          onPress={() => setShowPass(!showPass)}
        >
          <Image source={image} style={{ height: 25, width: 25 }} />
        </TouchableOpacity>
      )}
    </View>
  );
};
