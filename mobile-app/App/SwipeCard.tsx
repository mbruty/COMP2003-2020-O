import React from "react";
import { Image, ImagePropTypes, StyleSheet, Text, View, ScrollView, TouchableOpacity} from "react-native";
import { red } from "react-native-redash";
import { AwsomeCardItem } from "./AwsomeCardItem";
import { CONSTANT_STYLES } from "./shared/constants";

export interface Item {
  text: string;
  enabled: boolean;
}

interface Props {
  items: Array<Item>;
  title: string;
  imageURI: string;
}

export const SwipeCard: React.FC<Props> = (props) => {
  return (
    <View style={[styles.container]}>
      <View style={[styles.card, CONSTANT_STYLES.BG_BASE_COLOUR]}>
        <Image
         style={[styles.image]}
         source={{ uri: props.imageURI }}
        />
        <Text style={styles.title}>{props.title}</Text>
        <ScrollView >
          {
            props.items.map(item => (
              <AwsomeCardItem
              text={item.text}
              enabled={item.enabled} />
            ))
          }
        </ScrollView>
      </View>
      <View style={[styles.btnBox]}>
          <Image
            style={[styles.btnYes]}
            source={require("./tick.png")}
          />
          <Image
            style={[styles.btnNo]}
            source={require("./cross.png")}
          />
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0)',
  },
  title: {
      fontSize: 25,
      //fontWeight: "bold",
      //fontFamily: "",
      textAlign: "center",
  },
  card: {
    marginTop: "5%",
    width: "95%",
    height: 480,
    borderRadius: 30,
  },
  image: {
    width: "100%", 
    height: 200, 
    resizeMode: "stretch",
    borderBottomRightRadius: 70,
    borderBottomLeftRadius: 0, 
    borderRadius:20,
    alignSelf: "center",
  },
  btnBox: {
    flexDirection: "row",
    marginTop: 10,
    width: "100%",
    backgroundColor: 'rgba(0,0,0,0)',
  },
  btnYes: {
    marginLeft: "60%",
    width: 75, 
    height: 75, 
    resizeMode: "stretch",
  },
  btnNo: {
    marginLeft: "-60%",
    width: 75, 
    height: 75, 
    resizeMode: "stretch",
  },
});