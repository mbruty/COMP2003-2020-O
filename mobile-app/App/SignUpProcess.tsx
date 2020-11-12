import React, { useReducer, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { IData } from "./shared/IData";
import { EmailConfirm } from "./SignUpProcess/EmailConfirm";
import { IUser } from "./SignUpProcess/IUser";
import { Preferences } from "./SignUpProcess/Preferences";
import { SignUp } from "./SignUpProcess/SignUp";

interface Props {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  user: IUser;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
}
let nick = "";

export const SignUpProcess: React.FC<Props> = (props) => {
  const [pageNo, setPageNo] = useState<number>(0);
  const submit = () => {
    props.setPage("main");
  };

  const next = () => {
    setPageNo(pageNo + 1);
  };

  const goToEmail = (inNick: string, id: string, authToken: string) => {
    nick = inNick;
    setPageNo(pageNo + 1);
    props.setUser({ id, authToken });
  };

  switch (pageNo) {
    case 0:
      return <SignUp next={goToEmail} />;
    case 1:
      return <EmailConfirm next={next} />;
    case 2:
      return (
        <SafeAreaView style={styles.container}>
          <Preferences
            authToken={props.user.authToken}
            userId={props.user.id}
            onSubmit={submit}
            fName={nick}
          />
        </SafeAreaView>
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
