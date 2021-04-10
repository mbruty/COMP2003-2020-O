import React from "react";
import { Button, StyleSheet, Text, View, BackHandler, Dimensions } from "react-native";
import { Page } from "./GroupPageRouter";
import * as Location from 'expo-location';
import MapView, { LatLng, Marker, Circle } from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import { CONSTANT_COLOURS } from "../../constants";
import Slider from "@react-native-community/slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';

interface Props {
  setPage?: React.Dispatch<React.SetStateAction<Page>>;
  onSave: () => void;
  onBack?: () => void;
  isGroup: boolean;
}

let mapRef = null;

const mile2meter = (distance: number) => distance * 1609.344;

const SelectLocation: React.FC<Props> = (props) => {


  const [distance, setDistance] = React.useState(1);

  const [markerLocation, setMarkerLocation] = React.useState<LatLng | undefined>();

  React.useEffect(() => {
    if (mapRef) {
      mapRef.animateToRegion({
        latitude: markerLocation.latitude,
        longitude: markerLocation.longitude
      });
    } else {
      console.log("Nope");
    }
  }, [markerLocation])

  React.useEffect(() => {
    if (!props.isGroup) {
      (async () => {
        const settings = JSON.parse(await AsyncStorage.getItem("location"));
        if (settings) {
          setMarkerLocation(settings.latlon);
          setDistance(settings.distance);
        }
      })();
    }
  }, [])

  React.useEffect(() => {
    const backAction = () => {
      if (props.setPage)
        props.setPage(Page.join_create);
      else
        props.onBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );
    return () => backHandler.remove();
  }, []);


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
    return (
      <View style={styles.container}>
        <MapView
          onResponderStart={() => console.log("Ha")}
          compassOffset={{
            x: 0,
            y: 25
          }}
          loadingEnabled={true}
          showsUserLocation={true}
          style={styles.map}
          initialRegion={{
            latitude: markerLocation.latitude,
            longitude: markerLocation.longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
          onPress={e => {
            setMarkerLocation(e.nativeEvent.coordinate)
          }}
          ref={ref => { mapRef = ref; }}
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
        <View style={{
          position: "absolute",
          top: 20,
          left: 20,
        }}>
          <TouchableOpacity style={{
            backgroundColor: "white",
            paddingHorizontal: 10,
            paddingVertical: 10,
            borderRadius: 100,
            marginBottom: 15
          }}
            onPress={() => {
              if (props.setPage)
                props.setPage(Page.join_create);
              else
                props.onBack();
            }}>
            <MaterialCommunityIcons name="keyboard-backspace" size={24} color="black" />
          </TouchableOpacity>


        </View>
        <View style={{
          width: "100%",
        }}>
          <TouchableOpacity onPress={async () => {
            const userLocation = await Location.getCurrentPositionAsync({});

            setMarkerLocation({
              latitude: userLocation.coords.latitude,
              longitude: userLocation.coords.longitude,
            });
          }}
            style={{
              backgroundColor: CONSTANT_COLOURS.RED,
              paddingHorizontal: 10,
              paddingVertical: 10,
              width: 44,
              height: 44,
              borderRadius: 100,
              marginLeft: "auto",
              marginRight: 20,
              marginBottom: 15
            }}>
            <MaterialIcons name="my-location" size={24} color="white" />
          </TouchableOpacity>
          <View style={[styles.box]}>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                paddingTop: 10
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
              if (props.isGroup) {
                await AsyncStorage.setItem("groupLocation", JSON.stringify({ latlon: markerLocation, distance: Math.round(distance * 10) / 10 }));
              } else {
                const settings = JSON.parse(await AsyncStorage.getItem("location"));
                console.log("Settings:", settings);
                await AsyncStorage.setItem("location", JSON.stringify({ ...settings, latlon: markerLocation, distance: Math.round(distance * 10) / 10 }));
                const settings2 = JSON.parse(await AsyncStorage.getItem("location"));
                console.log("Settings2:", settings2);
              }
              props.onSave();
              // I think this is in the right place:
              props.setPage(Page.host_waiting);
              //
            }}>
              <View style={styles.btn}>
                <Text style={[styles.text, { color: "white" }]}>Save Location</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </View >
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
    height: Dimensions.get("screen").height - 100,
    zIndex: 100

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
    backgroundColor: "white",
    width: "100%",
    paddingBottom: 50,
    display: "flex",
    flexDirection: "column",
    padding: 10,
    borderRadius: 20,
    borderColor: "#AAAAAA",
    borderWidth: 1,
    alignSelf: "center",
    shadowColor: "black",
    shadowOffset: {
      height: -5,
      width: 0
    },
    shadowOpacity: 0.2,
    elevation: 2,
    paddingHorizontal: 35,
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