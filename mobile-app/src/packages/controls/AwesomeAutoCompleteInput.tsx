import { StyleSheet, Text, View, TouchableOpacity } from "react-native";

import React from "react";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-gesture-handler";
import { CONSTANT_COLOURS, CONSTANT_STYLES } from "../../constants";

interface Props {
  // setValue: React.Dispatch<React.SetStateAction<string>>;
  setValue: any;
  value: string;
  autoComplete?: Array<string>;
  onLike: (tag: string) => void;
  onDisLike: (tag: string) => void;
}

const AwesomeAutoCompleteInput: React.FC<Props> = (props) => {
  return (
    <>
      <View style={styles.searchContainer}>
        <MaterialIcons
          name="search"
          size={24}
          color={CONSTANT_COLOURS.DARK_GREY}
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.textInput}
          value={props.value}
          onChange={(newText) => props.setValue(newText.nativeEvent.text)}
        />
      </View>
      {props.autoComplete?.map((item, index) => (
        <View
          style={[
            // Add a bottom radius to the end item
            styles.item,
            {
              borderBottomRightRadius:
                index === props.autoComplete.length - 1 ? 10 : 0,
            },
            {
              borderBottomLeftRadius:
                index === props.autoComplete.length - 1 ? 10 : 0,
            },
          ]}
        >
          <TouchableOpacity onPress={() => props.onLike(item)}>
            <Ionicons
              name="ios-thumbs-up"
              size={24}
              style={[
                { paddingRight: 25, paddingLeft: 10, paddingVertical: 10 },
              ]}
              color={CONSTANT_COLOURS.DARK_GREY}
            />
          </TouchableOpacity>
          <Text
            style={[
              CONSTANT_STYLES.TXT_DEFAULT,
              { alignSelf: "center" },
            ]}
          >
            {item}
          </Text>
          <TouchableOpacity onPress={() => props.onDisLike(item)}>
            <Ionicons
              name="ios-thumbs-down"
              style={{ paddingLeft: 25, paddingRight: 10, paddingVertical: 10 }}
              size={24}
              color={CONSTANT_COLOURS.DARK_GREY}
            />
          </TouchableOpacity>
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    width: "80%",
    borderRadius: 50,
    borderColor: "#AAAAAA",
    borderWidth: 1,
  },
  item: {
    display: "flex",
    width: "70%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#FFF",
    borderTopColor: "#fff",
    borderColor: "#AAAAAA",
    borderWidth: 1,
  },
  searchIcon: {
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  textInput: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#fff",
    color: "#424242",
    borderTopRightRadius: 50,
    borderBottomRightRadius: 50,
  },
});

export default AwesomeAutoCompleteInput;
