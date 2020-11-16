import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import MainScreen from "./src/packages/main-sequence";
import { LogIn, SignUpProcess } from "./src/packages/user";
import { IUser } from "./src/packages/user/IUser";

export default function App() {
  const [user, setUser] = useState<IUser>();

  /* For development set this to the page you're making..
  Set this to "main" when publishing */

  const [page, setPage] = useState<string>("log-in");

  const logIn = (token: string) => {
    setUser({ authToken: token });
    setPage("main");
  };

  // Render the different pages by name of page
  switch (page) {
    case "sign-up":
      return <SignUpProcess setUser={setUser} setPage={setPage} user={user} />;
      break;
    case "log-in":
      return (
        <SafeAreaView style={styles.container}>
          <LogIn setPage={setPage} submit={logIn} />
        </SafeAreaView>
      );
      break;
    case "main":
      return (
        <SafeAreaView style={styles.container}>
          <MainScreen />
        </SafeAreaView>
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