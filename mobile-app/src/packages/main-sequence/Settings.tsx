import React, { useEffect, useState } from "react";
import Slider from "@react-native-community/slider";
import {
  Text,
  View,
  Button,
  Modal,
  Alert,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Switch,
  ScrollView,
} from "react-native";
import * as Location from "expo-location";
import { CONSTANT_STYLES, CONSTANT_COLOURS } from "../../constants";
import { AwesomeTextInput } from "react-native-awesome-text-input";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import deleteUser from "../requests/deleteUser";
import MapView, { LatLng, Marker, Circle } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import SelectLocation from "./SelectLocation";

const mile2meter = (distance: number) => distance * 1609.344;

interface Props {
  logOut: () => void;
  setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  scrollEnabled: boolean;
}

let mapRef = null;

const Settings: React.FC<Props> = (props) => {
  const [modalVisiblePassword, setModalVisiblePassword] = useState(false);
  const [modalVisibleName, setModalVisibleName] = useState(false);
  const [modalVisibleDelete, setModalVisibleDelete] = useState(false);
  const [distance, setDistance] = useState(25);
  const [toggle, setToggle] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);

  const [markerLocation, setMarkerLocation] = React.useState<
    LatLng | undefined
  >();

  React.useEffect(() => {
    if (mapRef) {
      mapRef.animateToRegion({
        latitude: markerLocation.latitude,
        longitude: markerLocation.longitude,
      });
    } else {
      console.log("Nope");
    }
  }, [markerLocation]);

  useEffect(() => {
    (async () => {
      try {
        const settings = JSON.parse(await AsyncStorage.getItem("location"));
        console.log("settings", settings);

        setToggle(settings.toggle);
        setDistance(settings.distance || 1);
        setMarkerLocation(settings.latlon);
      } catch (e) {
        console.log(e);

        // Couldn't get settings... Just continue with defaults
      }
    })();
  }, [showMap]);

  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});

      setMarkerLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
    })();
  }, []);

  // Is any modal showing?
  const modalShowing =
    modalVisibleName || modalVisiblePassword || modalVisibleDelete;
  if (showMap) {
    return (
      <SelectLocation
        isGroup={false}
        onSave={() => setShowMap(false)}
        onBack={() => setShowMap(false)}
      />
    );
  }
  return (
    <ScrollView style={{ opacity: modalShowing ? 0.2 : 1 }}>
      <View style={{ paddingHorizontal: 25, paddingBottom: 200 }}>
        <Text style={styles.title}>Distance Preferences</Text>
        <View style={styles.box}>
          <View style={[styles.mapContainer]}>
            {markerLocation && (
              <MapView
                compassOffset={{
                  x: 0,
                  y: 25,
                }}
                showsUserLocation={true}
                style={styles.map}
                region={{
                  latitude: markerLocation.latitude,
                  longitude: markerLocation.longitude,
                  latitudeDelta: 0.05,
                  longitudeDelta: 0.05,
                }}
                ref={(ref) => {
                  mapRef = ref;
                }}
              >
                <Marker coordinate={markerLocation} />
                <Circle
                  center={markerLocation}
                  radius={mile2meter(distance)}
                  fillColor="rgba(255, 255, 255, 0.4)"
                  strokeColor="rgba(0,0,0,0.5)"
                  zIndex={25}
                  strokeWidth={2}
                />
              </MapView>
            )}
          </View>
          <TouchableOpacity
            onPress={() => setShowMap(true)}
            style={{
              backgroundColor: "rgba(0,0,0,0.05)",
              borderRadius: 20,
              marginTop: 10,
            }}
          >
            <Text style={[styles.text]}>Open Distance Preferences</Text>
          </TouchableOpacity>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 10,
            }}
          >
            <Text style={styles.text}>Always use my current location</Text>
            <Switch
              trackColor={{ false: "#767577", true: "#19e664" }}
              thumbColor={"#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={() => {
                (async () => {
                  try {
                    const settings = JSON.parse(
                      await AsyncStorage.getItem("location")
                    );
                    console.log("Settings:", settings);
                    await AsyncStorage.setItem(
                      "location",
                      JSON.stringify({ ...settings, toggle: !toggle })
                    );
                  } catch (e) {
                    console.log("error", e);
                  }
                })().then(() => setToggle(!toggle));
              }}
              value={toggle}
            />
          </View>
        </View>
        <View style={styles.spacer} />

        <Text style={styles.title}>Food Preferences</Text>
        <TouchableOpacity
          onPress={() => console.log("Food Preferences Clicked")}
          style={styles.box}
        >
          <Text style={styles.text}>Change Preferences</Text>
        </TouchableOpacity>
        <View style={styles.spacer} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisiblePassword}
          onRequestClose={() => {
            setModalVisiblePassword(false);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisiblePassword(false);
            }}
          >
            <View style={[styles.filledContainer]}>
              <Text>Change Password</Text>
              <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="Previous Password"
              />
              <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="New Password"
              />
              <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25 },
                }}
                label="Confirm Password"
              />
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisiblePassword(false);
                  }}
                >
                  <View style={[styles.btn]}>
                    <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                      CANCEL
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalVisiblePassword(false);
                  }}
                >
                  <View style={[styles.btn]}>
                    <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                      SUBMIT
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleName}
          onRequestClose={() => {
            setModalVisibleName(false);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisibleName(false);
            }}
          >
            <View style={[styles.filledContainer]}>
              <Text style={styles.title}>Change Nickname</Text>
              <View style={styles.spacer} />
              <AwesomeTextInput
                customStyles={{
                  title: CONSTANT_STYLES.TXT_DEFAULT,
                  container: { marginTop: 25, paddingBottom: 25 },
                }}
                label="New Nickname"
              />
              <View style={styles.btnContainer}>
                <TouchableOpacity
                  onPress={() => {
                    setModalVisibleName(false);
                  }}
                >
                  <View style={[styles.btn]}>
                    <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                      CLOSE
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    setModalVisibleName(false);
                  }}
                >
                  <View style={[styles.btn]}>
                    <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                      SAVE
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisibleDelete}
          onRequestClose={() => {
            setModalVisibleDelete(false);
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              setModalVisibleDelete(false);
            }}
          >
            <View style={[styles.filledContainer]}>
              <Text style={styles.title}>
                Are you sure you want to delete your account?
              </Text>
              <View style={[styles.btnContainer, { marginTop: 20 }]}>
                <TouchableOpacity
                  onPress={(e) => {
                    console.log(e);
                    setModalVisibleName(false);
                  }}
                >
                  <View style={[styles.btn, CONSTANT_STYLES.BG_DARK_GREY]}>
                    <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                      CANCEL
                    </Text>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => {
                    console.log("press");
                    deleteUser();
                    setModalVisibleName(false);
                  }}
                >
                  <View style={[styles.btn, CONSTANT_STYLES.BG_RED]}>
                    <Text style={[styles.btnTxt, CONSTANT_STYLES.TXT_BASE]}>
                      DELETE
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>

        <Text style={styles.title}>Account</Text>
        <TouchableOpacity
          style={styles.box}
          onPress={() => setModalVisibleName(!modalVisibleName)}
        >
          <Text style={styles.text}>Change Nickname</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => setModalVisiblePassword(!modalVisibleName)}
        >
          <Text style={styles.text}>Change Password</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => {
            props.logOut();
          }}
        >
          <Text style={styles.text}>Log Out</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => console.log("Reset Pressed")}
        >
          <Text style={styles.danger}>Reset Account</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.box}
          onPress={() => setModalVisibleDelete(true)}
        >
          <Text style={styles.danger}>Delete Account</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0)",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 10,
  },
  mapContainer: {
    width: "100%",
    height: 150,
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
    textAlign: "center",
    color: CONSTANT_COLOURS.DARK_GREY,
  },
  btn: {
    marginTop: 5,
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 5,
    backgroundColor: "#369aff",
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
  },
  title: {
    fontWeight: "bold",
    marginTop: 15,
    color: CONSTANT_COLOURS.DARK_GREY,
    fontSize: 18,
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
});

export default Settings;
