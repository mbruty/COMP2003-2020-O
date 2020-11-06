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
    <View style={styles.container}>
      <Image style={styles.img} source={props.image} />
      <Text style={styles.txt}>{props.text}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  img: {
    height: 50,
    width: 50,
  },
  txt: {
    textAlign: "center",
  },
});
