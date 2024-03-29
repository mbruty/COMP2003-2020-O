import React, { useEffect, useState } from "react";
import { Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { auth, includeAuth, reset } from "./src/packages/includeAuth";
import MainScreen from "./src/packages/main-sequence";
import { LogIn, SignUpProcess } from "./src/packages/user";
import authCheck from "./src/packages/requests/authCheck";
import { IUser } from "./src/packages/user/IUser";
import * as Notifications from "expo-notifications";
import { Loading } from "./src/Loading";
import { AuthContext } from "./src/AuthContext";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function App() {
  const [user, setUser] = useState<auth>(undefined);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  /* For development set this to the page you're making..
  Set this to "main" when publishing */

  const [page, setPage] = useState<string>("loading");
  const logIn = () => {
    setIsLoggedIn(true);
    includeAuth().then((authObj) => setUser(authObj));
    setPage("main");
  };

  const logOut = () => {
    console.log("logging out");
    reset();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    authCheck().then((loggedIn) => {
      setIsLoggedIn(loggedIn);
      if (!loggedIn && page !== "log-in") {
        setPage("log-in");
      } else {
        setPage("main");
        includeAuth().then((authObj) => {
          setUser(authObj);
        });
      }
    });
  }, [isLoggedIn]);

  includeAuth().then((res) => console.log(res));

  // Render the different pages by name of page
  const renderPage = () => {
    switch (page) {
      case "sign-up":
        return (
          <SignUpProcess setUser={setUser} setPage={setPage} user={user} />
        );
      case "log-in":
        return (
          <View style={styles.container}>
            <LogIn setPage={setPage} submit={logIn} />
          </View>
        );
      case "main":
        return (
          <View style={styles.container}>
            <MainScreen logOut={logOut} />
          </View>
        );
      case "loading":
        return <Loading />;
      default:
        return (
          <View style={styles.container}>
            <Text>There was an error loading the app...</Text>
          </View>
        );
    }
  };
  console.log({ user });

  return (
    <AuthContext.Provider value={user}>{renderPage()}</AuthContext.Provider>
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
