import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View, Text } from "react-native";
import {
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { MeiliSearch } from "meilisearch";
import { CONSTANT_COLOURS } from "../../constants";

const AutoComplete: React.FC<{}> = (props) => {
  const [text, setText] = React.useState<string>("");
  const [options, setOptions] = React.useState<Pick<any, string>[]>([]);
  const index = React.useMemo(
    () => new MeiliSearch({ host: "http://46.101.48.57" }).index("foodtags"),
    []
  );

  const handleTextChange = async (text: string) => {
    setText(text);
    if (text !== "") {
      const { hits } = await index.search(text);
      setOptions(hits);
    } else {
      setOptions([]);
    }
  };
  return (
    <ScrollView style={styles.container}>
      <View style={styles.search}>
        <AntDesign name="search1" size={24} color="black" />
        <TextInput
          value={text}
          onChangeText={handleTextChange}
          placeholder="Search for your favourite food"
          style={styles.input}
        />
      </View>
      {options.map((option) => (
        <TouchableOpacity style={styles.option} onPress={() => {
          // ToDo: Send favourite to api
          setText("");
          setOptions([]);
        }}>
          <Text>{option.tag}</Text>
          <AntDesign name="checkcircleo" size={18} color={CONSTANT_COLOURS.RED} style={{marginRight: 0, marginLeft: "auto"}}/>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "80%",
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginTop: 5,
    marginLeft: "auto",
    marginRight: "auto",
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    display: "flex",
    flexDirection: "column",
    alignContent: "center",
    maxHeight: 200,
  },
  option: {
    backgroundColor: "#ECECEC",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
    display: "flex",
    flexDirection: "row"
  },
  search: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    alignItems: "center",
    width: "100%",
  },
  input: {
    flex: 1,
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 10,
    paddingLeft: 0,
    backgroundColor: "#F7F7F7",
    color: "#424242",
  },
});
export default AutoComplete;
