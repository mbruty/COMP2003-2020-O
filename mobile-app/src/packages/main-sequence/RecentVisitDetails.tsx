import React from "react";
import {
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Linking,
  LogBox,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  API_URL,
  CONSTANT_COLOURS,
  IMG_URL,
} from "../../constants";
import {
  AntDesign,
  Foundation,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import Clipboard from "expo-clipboard";
import DatePicker from "@react-native-community/datetimepicker";
import { auth } from "../includeAuth";
import TapRating from "react-native-ratings/dist/TapRating";
interface Props {
  restaurantId: number;
  roomCode?: number;
  rating: number;
  onClose: () => void;
}

const { width, height } = Dimensions.get("screen");

const RecentVisitDetails: React.FC<Props> = (props) => {
  const [rdata, setData] =
    React.useState<{ restaurant: RequestObj } | undefined>();
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = React.useState<boolean>(false);
  const [scrollAmount, setScrollAmount] = React.useState<number>(1);

  const [size, setSize] = React.useState<number>(1);
  const [date, setDate] = React.useState<Date>(new Date());

  function ratingCompleted(newRating){
    console.log("New rating is: " + newRating);
    //Update rating in datbase here
  }


  React.useEffect(() => {
    (async () => {
      console.log(props);

      const promise1 = fetch(API_URL + "/restaurant/" + props.restaurantId);

      const [restaurant] = await Promise.all([promise1]);

      const rdata: RequestObj = await restaurant.json();
      console.log("rdata" && rdata);

      setData({ restaurant: rdata });
    })();
  }, [props.roomCode]);
  React.useEffect(() => {
    LogBox.ignoreLogs(["VirtualizedLists should never be nested"]);
  }, []);

  const handleSizeChange = (e: number) => {
    if (e < 1) {
      setSize(1);
    } else {
      setSize(e);
    }
  };

  if (!rdata) {
    return <Text>Loading...</Text>;
  }

  return (
    <>
      <View style={styles.container}>
      <MapView
          style={styles.map}
          compassOffset={{
            x: 0,
            y: 25,
          }}
          showsUserLocation={true}
          region={{
            latitude: rdata.restaurant.restaurant.Latitude,
            longitude: rdata.restaurant.restaurant.Longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: rdata.restaurant.restaurant.Latitude,
              longitude: rdata.restaurant.restaurant.Longitude,
            }}
          />
        </MapView>
      </View>
      <ScrollView
        overScrollMode="auto"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={100}
        onScroll={(e) => {
          // If the scroll amount is negative
          if (e.nativeEvent.contentOffset.y < 0) {
            if (e.nativeEvent.contentOffset.y <= -75) {
              // If they have pulled down enough
              props.onClose();
            }
            setScrollAmount(e.nativeEvent.contentOffset.y);
          } else setScrollAmount(1);
        }}
      >
        <KeyboardAvoidingView
          style={{ marginTop: "70%", width: "100%" }}
          behavior="position"
        >
          <View
            style={{
              paddingTop: 25,
              width: "100%",
              borderTopRightRadius: 25,
              borderTopLeftRadius: 25,
              backgroundColor: "white",
              borderColor: CONSTANT_COLOURS.DARK_GREY,
              borderWidth: 1,
              marginBottom: 100,
            }}
          >
            {scrollAmount < 0 && (
              <View
                style={{
                  opacity: Math.abs(scrollAmount) / 100,
                  width: "100%",
                  display: "flex",
                  justifyContent: "center",
                  height: 14,
                  flexDirection: "row",
                }}
              >
                <Text
                  style={{
                    color: CONSTANT_COLOURS.DARK_GREY,
                    fontWeight: "bold",
                    marginTop: -8,
                  }}
                >
                  CLOSE
                </Text>
              </View>
            )}
            {scrollAmount > 0 && (
              <View
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "100%",
                  flexDirection: "row",
                  marginBottom: 10,
                }}
              >
                <View
                  style={{
                    width: "10%",
                    backgroundColor: "#CDCDCD",
                    height: 4,
                    borderRadius: 50,
                  }}
                />
              </View>
            )}
            <Text
              style={{
                paddingLeft: 25,
                fontSize: 30,
                fontWeight: "bold",
                color: CONSTANT_COLOURS.DARK_GREY,
              }}
            >
              {rdata.restaurant.restaurant.RestaurantName}
            </Text>
            <Text style={styles.text}>
              {rdata.restaurant.restaurant.RestaurantDescription}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const url = `tel:${rdata.restaurant.restaurant.Phone}`;
                Linking.canOpenURL(url).then((supported) => {
                  // If we can open the telephone url
                  if (supported) return Linking.openURL(url);
                  // else copy the number to clipboard
                  Clipboard.setString(rdata.restaurant.restaurant.Phone);
                  alert("Phone number coppied to clipboard");
                });
              }}
              style={{
                paddingLeft: 25,

                display: "flex",
                flexDirection: "row",
                paddingVertical: 10,
              }}
            >
              <Foundation
                name="telephone"
                size={24}
                color={CONSTANT_COLOURS.DARK_GREY}
              />
              <Text
                style={{
                  paddingLeft: 5,
                  paddingTop: 3,
                  color: CONSTANT_COLOURS.DARK_GREY,
                }}
              >
                Telephone: {rdata.restaurant.restaurant.Phone}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                let daddr = encodeURIComponent(
                  `${rdata.restaurant.restaurant.Street1} ${rdata.restaurant.restaurant.Postcode}`
                );

                if (Platform.OS === "ios") {
                  Linking.openURL(`http://maps.apple.com/?daddr=${daddr}`);
                } else {
                  Linking.openURL(`http://maps.google.com/?daddr=${daddr}`);
                }
              }}
              style={{
                display: "flex",
                flexDirection: "row",
                paddingVertical: 10,
                paddingLeft: 25,
              }}
            >
              <MaterialCommunityIcons
                name="google-maps"
                size={24}
                color={CONSTANT_COLOURS.DARK_GREY}
              />
              <Text
                style={{
                  paddingLeft: 5,
                  paddingTop: 3,
                  color: CONSTANT_COLOURS.DARK_GREY,
                }}
              >
                Open in maps
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 20,
                paddingVertical: 10,
                paddingLeft: "33%",
                color: CONSTANT_COLOURS.DARK_GREY,
              }}
            >
              Leave a Rating
            </Text>
            <TapRating 
              showRating
              defaultRating={props.rating}
              onFinishRating={ratingCompleted}
            />
            <View style={styles.spacer} />
            <Text
              style={{
                fontSize: 20,
                paddingVertical: 10,
                paddingLeft: 25,
                alignSelf: "center",
                color: CONSTANT_COLOURS.DARK_GREY,
              }}
            >
            Make a booking
            </Text>
            {showDatePicker && (
              <DatePicker
                display="calendar"
                value={date}
                mode="date"
                onChange={(_, newDate) => {
                  if (newDate) {
                    date.setDate(newDate.getDate());
                    setDate(date);
                  }
                  setShowDatePicker(false);
                }}
              />
            )}
            {showTimePicker && (
              <DatePicker
                display="clock"
                value={date}
                mode="time"
                onChange={(_, newTime) => {
                  if (newTime) {
                    date.setTime(newTime.getTime());
                    setDate(date);
                  }
                  setShowTimePicker(false);
                }}
              />
            )}
            {Platform.OS === "android" && (
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  marginLeft: 70,
                }}
              >
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={{ color: "#007aff", fontSize: 20 }}>
                    {date.toLocaleDateString()}
                  </Text>
                </TouchableOpacity>
                <View style={{ width: 20 }} />
                <TouchableOpacity
                  style={styles.btn}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text style={{ color: "#007aff", fontSize: 20 }}>
                    {date.toLocaleTimeString()}
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {Platform.OS === "ios" && (
              <DatePicker
                style={{ marginLeft: 20 }}
                onChange={(_, selectedDate) => {
                  if (selectedDate) {
                    setDate(selectedDate);
                  }
                }}
                value={date}
                mode="datetime"
                minimumDate={new Date()}
                display="compact"
              />
            )}
            <Text style={{color: CONSTANT_COLOURS.DARK_GREY, paddingTop: 10, fontSize: 15, paddingLeft: "40%"}}>Party Size</Text>
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                width: "100%",
                justifyContent: "center",
                borderColor: CONSTANT_COLOURS.DARK_GREY,
              }}
            >
              <View
                style={{
                  borderColor: CONSTANT_COLOURS.DARK_GREY,
                  borderWidth: 1,
                  display: "flex",
                  flexDirection: "row",
                  borderRadius: 11,
                }}
              >
                <TouchableOpacity
                  style={{
                    backgroundColor: CONSTANT_COLOURS.RED,
                    padding: 10,
                    borderTopLeftRadius: 10,
                    borderBottomLeftRadius: 10,
                    marginRight: 10,
                  }}
                  onPress={() => handleSizeChange(size - 1)}
                >
                  <Text>-</Text>
                </TouchableOpacity>
                <TextInput
                  value={size.toString()}
                  keyboardType="number-pad"
                  onChangeText={(e) => handleSizeChange(parseInt(e))}
                />
                <TouchableOpacity
                  style={{
                    backgroundColor: CONSTANT_COLOURS.RED,
                    padding: 10,
                    borderTopRightRadius: 10,
                    borderBottomRightRadius: 10,
                    marginLeft: 10,
                  }}
                  onPress={() => handleSizeChange(size + 1)}
                >
                  <Text>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={{
                width: "95%",
                marginTop: 20,
                marginBottom: 25,
                marginHorizontal: 10,
                backgroundColor: CONSTANT_COLOURS.RED,
                padding: 10,
                borderRadius: 50,
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
              }}
              onPress={async () => {
                if (rdata.restaurant.restaurant.WebhookURI) {
                  // Need a way to get the user's email
                  const res = await fetch(
                    rdata.restaurant.restaurant.WebhookURI,
                    {
                      method: "POST",
                      body: JSON.stringify({
                        dateTime: date,
                        partySize: size,
                        email: null,
                      }),
                    }
                  );
                  if (res.status === 200) {
                    // props.onComplete();
                  }
                } else {
                  alert(
                    "This restaurant isn't accepting our booking, please try calling them"
                  );
                }
              }}
            >
              <Text style={{ fontWeight: "bold", color: "white" }}>BOOK</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",
    alignItems: "center",
    height: Math.floor(Dimensions.get("screen").height / 2),
    zIndex: 0,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  text: {
    color: CONSTANT_COLOURS.DARK_GREY,
    paddingTop: 10,
    fontSize: 15,
    paddingLeft: 25,
  },
  btn: {
    backgroundColor: "#efeff0",
    padding: 10,
    borderRadius: 10,
  },
  spacer: {
    width: "100%",
    marginTop: 20,
    height: 1,
    borderColor: "white",
    borderWidth: 1,
    borderRadius: 2,
  },
});
export default RecentVisitDetails;
interface Restaurant {
  IsVerified: boolean;
  Longitude: number;
  Latitude: number;
  RestaurantID: number;
  OwnerID: number;
  RestaurantName: string;
  RestaurantDescription: string;
  Phone: string;
  Email: string;
  Site: string;
  Street1: string;
  Street2?: any;
  Town: string;
  County: string;
  Postcode: string;
  WebhookURI?: any;
}

interface RequestObj {
  Time: number;
  restaurant: Restaurant;
  message: string;
}