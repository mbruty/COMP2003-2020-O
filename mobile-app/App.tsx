import React, { useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { GroupTab } from "./App/GroupTab";
import { LogIn } from "./App/LogIn";
import { SignUpProcess } from "./App/SignUpProcess";
import { IUser } from "./App/SignUpProcess/IUser";
import { FormProgress } from "./App/SignUpProcess/shared/FormProgress";
import AnimatedCard from "./App/GroupTab/AnimatedScroll/AnimatedCard";

export default function App() {
  const [user, setUser] = useState<IUser>({ fName: "Mike" });

  /* For development set this to the page you're making..
  Set this to "main" when publishing */
  
  const [page, setPage] = useState<string>("sign-up");

  // Render the different pages by name of page
  switch (page) {
    case "sign-up":
      return <SignUpProcess setPage={setPage} user={user} />;
      break;
    case "log-in":
      return(
        <SafeAreaView style={styles.container}>
          <LogIn />
        </SafeAreaView>
      )
      break;
    case "main":
      return(
        <SafeAreaView style={styles.container}>
          <GroupTab />
        </SafeAreaView>
      )
    case "test":
      return <AnimatedCard />
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
