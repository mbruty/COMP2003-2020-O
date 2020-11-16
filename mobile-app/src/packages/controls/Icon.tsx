import React from "react";
import {
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  View,
} from "react-native";

interface Props {
  image: ImageSourcePropType;
  text: string;
}

export const Icon: React.FC<Props> = (props) => {
  return (
    <View style={styles.container} key={`icon ${props.text}`}>
      <Image style={styles.img} source={props.image} />
      <Text allowFontScaling={false} style={styles.txt}>{props.text}</Text>
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
