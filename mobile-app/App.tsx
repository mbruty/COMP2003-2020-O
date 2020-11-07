import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { SignUpProcess } from "./App/SignUpProcess";
import { IUser } from "./App/SignUpProcess/IUser";
import { FormProgress } from "./App/SignUpProcess/shared/FormProgress";

export default function App() {
  const [user, setUser] = useState<IUser>({ fName: "Mike" });

  /* For development set this to the page you're making..
  Set this to "main" when publishing */

  const [page, setPage] = useState<string>("sign-up");

  // Render the different pages by name of page
  switch (page) {
    case "sign-up":
      return (
        <View style={styles.container}>
          <SignUpProcess setPage={setPage} user={user} />
        </View>
      );
    default:
      return (
        <View style={styles.container}>
          <Text>There was an error loading the app...</Text>
        </View>
      );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
});
