import React, { useState } from "react";
import { Text, View, StyleSheet, TouchableOpacity } from "react-native";
import { CONSTANT_COLOURS } from "../../constants";
import { ScrollView } from "react-native-gesture-handler";
import { Page } from "./GroupPageRouter";
import { GroupObserver, SocketUser } from "./GroupObserver";
import { includeAuth } from "../includeAuth";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface Props {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
  isHost: boolean;
  onReady: () => void;
  roomCode: number;
  members: SocketUser[] | undefined;
  observer: GroupObserver;
}

const GroupWaitingRoom: React.FC<Props> = (props) => {
  const [me, setMe] = React.useState<string>();
  React.useEffect(() => {
    (async () => {
      const { userid } = await includeAuth();
      setMe(userid);
    })();
  }, []);

  return (
    <View style={{ display: "flex", height: "100%" }}>
      <TouchableOpacity
        style={{
          marginTop: 10,
          backgroundColor: "white",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 100,
          zIndex: 100,
          display: "flex",
          width: 140,
          flexDirection: "row",
          marginLeft: 15,
        }}
        onPress={() => {
          props.observer.leave();
        }}
      >
        <MaterialCommunityIcons
          name="keyboard-backspace"
          size={24}
          color="black"
        />
        <Text style={{ paddingLeft: 10, paddingTop: 3 }}>Leave Group</Text>
      </TouchableOpacity>
      <Text style={styles.title}>Room Code: {props.roomCode}</Text>
      <View style={styles.box}>
        <ScrollView>
          <Text style={[styles.text, { fontSize: 15 }]}>Members</Text>
          {props.members &&
            props.members.map((member) => (
              <View
                key={member.id}
                style={[
                  styles.box,
                  { flexDirection: "row", alignItems: "center" },
                ]}
              >
                <Text
                  style={{
                    color: CONSTANT_COLOURS.DARK_GREY,
                    textAlignVertical: "center",
                  }}
                >
                  {member.name}
                </Text>
                {member.ready ? (
                  <Text
                    style={{
                      textAlignVertical: "center",

                      color: "#43c42f",
                      fontWeight: "bold",
                      marginRight: 0,
                      marginLeft: "auto",
                    }}
                  >
                    Ready
                  </Text>
                ) : (
                  <Text
                    style={{
                      textAlignVertical: "center",
                      color: "#c4312f",
                      fontWeight: "bold",
                      marginRight: 0,
                      marginLeft: "auto",
                    }}
                  >
                    Not Ready
                  </Text>
                )}
                {props.isHost && member.id !== me && (
                  <TouchableOpacity
                    style={{
                      backgroundColor: CONSTANT_COLOURS.RED,
                      paddingVertical: 4,
                      paddingHorizontal: 10,
                      borderRadius: 5,
                      marginLeft: 15,
                    }}
                    onPress={() => {
                      props.observer.kick(member.id);
                    }}
                  >
                    <Text style={{ color: "white" }}>Kick</Text>
                  </TouchableOpacity>
                )}
              </View>
            ))}
          {!props.members && <Text>Loading...</Text>}
        </ScrollView>
      </View>
      <View style={{ marginTop: "auto", marginBottom: 10 }}>
        <Text style={{ marginLeft: 10, color: CONSTANT_COLOURS.DARK_GREY }}>
          Note: This group will expire after 24 hours of inactivity
        </Text>
      </View>
      <TouchableOpacity
        style={{
          backgroundColor: CONSTANT_COLOURS.RED,
          marginHorizontal: "10%",
          padding: "3%",
          borderRadius: 20,
          marginBottom: 150,
        }}
        onPress={() => {
          if (props.isHost) {
            props.observer.startSwipe();
          } else {
            // They aren't  host.. So just ready up
            props.onReady();
          }
        }}
      >
        <Text style={{ textAlign: "center", color: "white" }}>
          {props.isHost ? "Start Swiping" : "Ready Up"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
  filledContainer: {
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    backgroundColor: "rgba(255,255,255,255)",
    width: "100%",
    paddingTop: 15,
    paddingBottom: 50,
    marginTop: "75%",
    paddingHorizontal: 50,
    borderRadius: 50,
    borderColor: "#aaaaaa",
    borderWidth: 1,
  },
  text: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    color: CONSTANT_COLOURS.DARK_GREY,
  },
  btn: {
    marginTop: 5,
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: CONSTANT_COLOURS.RED,
  },
  btnTxt: {
    textAlign: "center",
    fontSize: 16,
  },
  btnContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
    width: "75%",
    alignSelf: "center",
    paddingTop: 5,
  },
  box: {
    backgroundColor: "white",
    width: "95%",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    borderRadius: 10,
    borderColor: "#AAAAAA",
    borderWidth: 1,
    alignSelf: "center",
    marginTop: 15,
    marginBottom: 10,
  },
  title: {
    fontWeight: "bold",
    marginTop: 15,
    color: CONSTANT_COLOURS.DARK_GREY,
    fontSize: 18,
    marginLeft: 15,
  },
  danger: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center",
    color: CONSTANT_COLOURS.RED,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
  spacer: {
    width: "100%",
    marginTop: 20,
    height: 1,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 2,
  },
  spacerContainer: {
    display: "flex",
    flexDirection: "row",
    width: "100%",
    paddingLeft: 10,
    marginBottom: 15,
  },
  spacer1: {
    width: "45%",
    marginTop: 17,
    height: 1,
    borderColor: "#CCC",
    borderWidth: 1,
    borderRadius: 2,
  },
});

export default GroupWaitingRoom;
