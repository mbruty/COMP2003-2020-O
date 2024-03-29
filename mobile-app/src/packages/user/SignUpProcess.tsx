import React, { useState } from "react";
import { SafeAreaView, StyleSheet, View } from "react-native";
import { auth } from "../includeAuth";
import EmailConfirm from "./EmailConfirm";
import { IUser } from "./IUser";
import PreferencesController from "./PreferencesController";
import SignUp from "./SignUp";

interface Props {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  user: auth;
  setUser: React.Dispatch<React.SetStateAction<auth>>;
}
let nick = "";

const SignUpProcess: React.FC<Props> = (props) => {
  const [pageNo, setPageNo] = useState<number>(0);
  const submit = () => {
    props.setPage("main");
  };

  const next = () => {
    setPageNo(pageNo + 1);
  };

  const goToEmail = (inNick: string, userid: string, authtoken: string) => {
    nick = inNick;
    setPageNo(pageNo + 1);
    props.setUser({ userid, authtoken });
  };

  // Routing the user through the sign-up sequence
  switch (pageNo) {
    case 0:
      return <SignUp close={() => props.setPage("log-in")} next={goToEmail} />;
    case 1:
      return <EmailConfirm next={next} />;
    case 2:
      return (
        <View style={styles.container}>
          <PreferencesController showBack={false} />
        </View>
      );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F1F1F1",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SignUpProcess;
