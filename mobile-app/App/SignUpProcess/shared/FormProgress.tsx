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
import { CONSTANT_STYLES } from "../../shared/constants";
import { Icon } from "../Preferences/FormProgress/Icon";

// ToDo: If this is ever needed any where else, maybe add this to the props?
const items: Array<{
  text: string;
  img: { active: ImageSourcePropType; inactive: ImageSourcePropType };
}> = [
  {
    text: "Create Your \nAccount",
    img: {
      active: require("../Preferences/FormProgress/account_circle_active.png"),
      inactive: require("../Preferences/FormProgress/account_circle_inactive.png"),
    },
  },
  {
    text: "Confirm Your \nEmail",
    img: {
      active: require("../Preferences/FormProgress/email_active.png"),
      inactive: require("../Preferences/FormProgress/email_inactive.png"),
    },
  },
  {
    text: "Select Your \nPreferences",
    img: {
      active: require("../Preferences/FormProgress/food_active.png"),
      inactive: require("../Preferences/FormProgress/food_inactive.png"),
    },
  },
];

interface Props {
  selectedIdx: number;
  allowBack: boolean;
  onSubmit: () => void;
  onBack?: () => void;
}
export const FormProgress: React.FC<Props> = (props) => {
  const dimensions = Dimensions.get("window");
  const imageWidth = dimensions.width;
  return (
    <>
      <View
        key={`FormProgress ${props.selectedIdx}`}
        style={[
          styles.container,
          {
            width: imageWidth - 25,
            justifyContent: "space-between",
            alignSelf: "center",
          },
        ]}
      >
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
      <View style={[styles.container, {paddingBottom: 25}]}>
        {props.allowBack && (
          <TouchableOpacity
            style={[
              props.selectedIdx === 0
                ? CONSTANT_STYLES.BG_LIGHT_GREY
                : CONSTANT_STYLES.BG_DARK_GREY,
              styles.btn,
              { left: 25, bottom: 0 },
            ]}
          >
            <Text style={[CONSTANT_STYLES.TXT_BASE, styles.txt]}>BACK</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[CONSTANT_STYLES.BG_RED, styles.btn, { right: 25, bottom: 0 }]}
          onPress={props.onSubmit}
        >
          <Text allowFontScaling={false} style={[CONSTANT_STYLES.TXT_BASE, styles.txt]}>
            SUBMIT
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
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
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    borderRadius: 10,
    position: "absolute",
  },
  txt: {
    fontWeight: "bold",
  },
});
