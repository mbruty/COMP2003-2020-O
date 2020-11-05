import React from "react";
import { ScrollView, StyleSheet, Text } from "react-native";
import { CustomTextInput } from "./Login/CustomTextInput";

interface Props {}

export const LogIn: React.FC<Props> = (props) => {
  return (
    <>
      <Text>Hello!!!!!</Text>
      <CustomTextInput label="Username or Email" isPassword={false} />
      <CustomTextInput label="Password" isPassword={true} />
    </>
  );
};