import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GroupTab } from "./App/GroupTab";
import { LogIn, SignIn } from "./App/LogIn";
import { SignUpProcess } from "./App/SignUpProcess";
import { IUser, loginState } from "./App/SignUpProcess/IUser";
import { FormProgress } from "./App/SignUpProcess/shared/FormProgress";
import AnimatedCard from "./App/GroupTab/AnimatedScroll/AnimatedCard";
import { API_URL } from "./App/constants";

export default function App() {
  const [user, setUser] = useState<IUser>({
    loginState: loginState.undefined,
  });

  /* For development set this to the page you're making..
  Set this to "main" when publishing */

  const [page, setPage] = useState<string>("log-in");

  const logIn = (values: SignIn) => {
    fetch(API_URL + "/login", {
      method: "POST",
      headers: {
        email: values.email,
        password: values.password,
      },
    })
      .then((response) => response.json())
      .then((response) => {
        if(response.message === "Logged in"){
          // ToDo Get user info
          setPage("main");
        }
        else {
          setUser({loginState: loginState.failed});
        }
        console.log(response.message);
      });
  };

  // Render the different pages by name of page
  switch (page) {
    case "sign-up":
      return <SignUpProcess setPage={setPage} user={user} />;
      break;
    case "log-in":
      return (
        <SafeAreaView style={styles.container}>
          <LogIn submit={logIn} loginState={user.loginState} />
        </SafeAreaView>
      );
      break;
    case "main":
      return (
        <SafeAreaView style={styles.container}>
          <GroupTab />
        </SafeAreaView>
      );
    case "test":
      return <AnimatedCard />;
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
