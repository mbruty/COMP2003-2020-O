import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { includeAuth, reset } from "./src/packages/includeAuth";
import MainScreen from "./src/packages/main-sequence";
import { LogIn, SignUpProcess } from "./src/packages/user";
import authCheck from "./src/packages/requests/authCheck";
import { IUser } from "./src/packages/user/IUser";

export default function App() {
  const [user, setUser] = useState<IUser>();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  /* For development set this to the page you're making..
  Set this to "main" when publishing */

  const [page, setPage] = useState<string>("main");

  const logIn = () => {
    setIsLoggedIn(true);
    setPage("main");
  };

  const logOut = () => {
    console.log("logging out")
    reset();
    setIsLoggedIn(false);
  }

  useEffect(() => {
    authCheck().then((res) => {
      setIsLoggedIn(res);
      console.log(isLoggedIn);
      if (!isLoggedIn && page !== "log-in") {
        setPage("log-in");
      } else {
        setPage("main");

      }
    });
  }, [isLoggedIn]);

  includeAuth().then((res) => console.log(res));

  // Render the different pages by name of page
  switch (page) {
    case "sign-up":
      return <SignUpProcess setUser={setUser} setPage={setPage} user={user} />;
      break;
    case "log-in":
      return (
        <View style={styles.container}>
          <LogIn setPage={setPage} submit={logIn} />
        </View>
      );
      break;
    case "main":
      return (
        <View style={styles.container}>
          <MainScreen logOut={logOut} />
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
