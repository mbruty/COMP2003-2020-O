import React, { useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { IData } from "./shared/IData";
import { IUser } from "./SignUpProcess/IUser";
import { Preferences } from "./SignUpProcess/Preferences";
import { SignUp } from "./SignUpProcess/SignUp";

interface Props {
  setPage: React.Dispatch<React.SetStateAction<string>>;
  user: IUser;
}

export const SignUpProcess: React.FC<Props> = (props) => {
  const [pageNo, setPageNo] = useState<number>(0);
  const submit = (data: IData) => {};

  switch (pageNo) {
    case 0:
      return <SignUp />;
      break;
    case 1:
      return null;
      break;
    case 2:
      return (
        <SafeAreaView style={styles.container}>
          <Preferences onSubmit={submit} fName={props.user.fName} />
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
