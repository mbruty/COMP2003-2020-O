import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Mail from "../../resources/icons/mail";
import Account from "../../resources/icons/account";
import Food from "../../resources/icons/food";

interface Props {
  text: string;
  index: number;
}

const getImage = (index: number) => {
  switch (index) {
    case 0:
      return <Account />;
    case 1:
      return <Mail />;
    case 2:
      return <Food />;
    default:
      return null;
  }
};

export const Icon: React.FC<Props> = (props) => {
  return (
    <View style={styles.container} key={`icon ${props.text}`}>
      {() => {
        getImage(props.index);
      }}
      <Text allowFontScaling={false} style={styles.txt}>
        {props.text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  img: {
    height: 35,
    width: 35,
  },
  txt: {
    textAlign: "center",
  },
});
