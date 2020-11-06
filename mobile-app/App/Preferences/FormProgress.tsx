import React from "react";
import {
  Dimensions,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableOpacityComponent,
  View,
} from "react-native";
import { CONSTANT_STYLES } from "../constants";
import { Icon } from "./FormProgress/Icon";

// ToDo: If this is ever needed any where else, maybe add this to the props?
const items: Array<{
  text: string;
  img: { active: ImageSourcePropType; inactive: ImageSourcePropType };
}> = [
  {
    text: "Create Your \nAccount",
    img: {
      active: require("./FormProgress/account_circle_active.png"),
      inactive: require("./FormProgress/account_circle_inactive.png"),
    },
  },
  {
    text: "Confirm Your \nEmail",
    img: {
      active: require("./FormProgress/email_active.png"),
      inactive: require("./FormProgress/email_inactive.png"),
    },
  },
  {
    text: "Select Your \nPreferences",
    img: {
      active: require("./FormProgress/food_active.png"),
      inactive: require("./FormProgress/food_inactive.png"),
    },
  },
];

interface Props {
  selectedIdx: number;
}
export const FormProgress: React.FC<Props> = (props) => {
  const dimensions = Dimensions.get("window");
  const imageWidth = dimensions.width;
  return (
    <>
      <View style={[styles.container, { width: imageWidth - 25 }]}>
        {items.map((x, index) => (
          <>
            <Icon
              text={x.text}
              image={
                index === props.selectedIdx ? x.img.active : x.img.inactive
              }
            />

            {index < items.length - 1 && <View style={styles.line} />}
          </>
        ))}
      </View>
      <View style={[styles.container, { marginTop: -15 }]}>
        <TouchableOpacity
          style={[
            props.selectedIdx === 0
              ? CONSTANT_STYLES.BG_LIGHT_GREY
              : CONSTANT_STYLES.BG_DARK_GREY,
            styles.btn,
            { marginRight: 150 },
          ]}
        >
          <Text style={[CONSTANT_STYLES.TXT_BASE, styles.txt]}>BACK</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[CONSTANT_STYLES.BG_RED, styles.btn]}>
        <Text style={[CONSTANT_STYLES.TXT_BASE, styles.txt]}>{props.selectedIdx === 2 ? "SUBMIT" : "NEXT"}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignSelf: "center",
    padding: 15,
    paddingTop: 25,
  },
  line: {
    height: 2,
    backgroundColor: "#707070",
    width: 50,
    alignSelf: "center",
    marginTop: -35,
    flexShrink: 1,
  },
  btn: {
    paddingLeft: 25,
    paddingRight: 25,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
  },
  txt: {
    fontWeight: "bold",
  },
});
