import React from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { Page } from "./GroupPageRouter";
import * as Location from 'expo-location';
import MapView, { LatLng, Marker, Circle } from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CONSTANT_COLOURS } from "../../constants";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
interface Props {
  setPage: React.Dispatch<React.SetStateAction<Page>>;
  onSave: () => void;
}

const mile2meter = (distance: number) => distance * 1609.344;

const SelectLocation: React.FC<Props> = (props) => {
  const [distance, setDistance] = React.useState(1);

  const [markerLocation, setMarkerLocation] = React.useState<LatLng | undefined>();
  React.useEffect(() => {
    (async () => {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});

      setMarkerLocation({
        latitude: userLocation.coords.latitude,
        longitude: userLocation.coords.longitude,
      });
    })();
  }, []);
  if (markerLocation) {
    console.log("Showing map");

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: markerLocation.latitude,
            longitude: markerLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05
          }}
          onPress={e => {
            setMarkerLocation(e.nativeEvent.coordinate)
          }}
        >
          <Marker coordinate={markerLocation}>

          </Marker>
          <Circle
            center={markerLocation}
            radius={mile2meter(distance)}
            fillColor="rgba(255, 255, 255, 0.4)"
            strokeColor="rgba(0,0,0,0.5)"
            zIndex={25}
            strokeWidth={2}
          />
        </MapView>
        <View style={styles.box}>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>Maximum Distance:</Text>
            <Text style={styles.text}>{Math.round(distance * 10) / 10} miles</Text>
          </View>
          <Slider
            style={{ height: 50 }}
            minimumValue={0}
            maximumValue={10}
            value={distance}
            step={0.1}
            minimumTrackTintColor={CONSTANT_COLOURS.RED}
            maximumTrackTintColor="#AAAAAA"
            thumbTintColor={CONSTANT_COLOURS.RED}
            onValueChange={(newValue) => setDistance(newValue)}
          />
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>Min</Text>
            <Text style={styles.text}>Max</Text>
          </View >
          <TouchableOpacity onPress={async () => {
            await AsyncStorage.setItem("location", JSON.stringify({latlon: markerLocation, distance: Math.round(distance * 10) / 10}));
            props.onSave();
          }}>
            <View style={styles.btn}>
              <Text style={[styles.text, { color: "white" }]}>Save Location</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  } else {
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    fontSize: 16,
    paddingTop: 5,
    paddingBottom: 5,
    textAlign: "center",
    color: CONSTANT_COLOURS.DARK_GREY,
  },
  box: {
    position: "absolute",
    bottom: "15%",
    backgroundColor: "white",
    width: "95%",
    display: "flex",
    flexDirection: "column",
    padding: 10,
    borderRadius: 10,
    borderColor: "#AAAAAA",
    borderWidth: 1,
    alignSelf: "center",
  },
  btn: {
    width: "80%",
    backgroundColor: CONSTANT_COLOURS.RED,
    borderRadius: 50,
    marginRight: "auto",
    marginLeft: "auto",
    padding: 5
  }
})
export default SelectLocation;