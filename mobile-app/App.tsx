import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { IUser } from "./App/IUser";
import { Preferences } from "./App/Preferences";

export default function App() {
  const [user, setUser] = useState<IUser>({fName: "Mike"});
  return (
    <SafeAreaView style={styles.container}>
      <Preferences fName={user.fName}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
});
