import React from "react";
import {
  Button,
  Dimensions,
  FlatList,
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
  RECOMMENDER_URL,
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
interface Props {
  restaurantId: number;
  auth: auth;
  isGroup: boolean;
  roomCode?: number;
  onClose: () => void;
}

interface ItemData {
  price: string;
  name: string;
  id: number;
}

const { width, height } = Dimensions.get("screen");

const MatchedScreen: React.FC<Props> = (props) => {
  const [data, setData] =
    React.useState<{ items: ItemData[]; restaurant: RequestObj } | undefined>();
  const [showDatePicker, setShowDatePicker] = React.useState<boolean>(false);
  const [showTimePicker, setShowTimePicker] = React.useState<boolean>(false);
  const [scrollAmount, setScrollAmount] = React.useState<number>(1);

  const [size, setSize] = React.useState<number>(1);
  const [date, setDate] = React.useState<Date>(new Date());

  React.useEffect(() => {
    (async () => {
      const promise1 = fetch(API_URL + "/restaurant/" + props.restaurantId);
      const promise2 = fetch(
        RECOMMENDER_URL +
          `/likeditems?isGroup=${"false"}&userID=${"2"}&restaurantID=${
            props.restaurantId
          }`
      );

      const [restaurant, items] = await Promise.all([promise1, promise2]);

      const rdata: RequestObj = await restaurant.json();

      const data = await items.json();
      setData({ items: data, restaurant: rdata });
    })();
  }, []);
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

  const renderItem = (item) => (
    <View key={item.foodID} style={{ marginRight: 25 }}>
      <Image
        style={{
          height: 240,
          width: 200,
          resizeMode: "cover",
          borderRadius: 20,
          alignSelf: "center",
        }}
        source={{ uri: IMG_URL + item.id + ".png?1=1" }}
      />
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <Text style={styles.text}>{item.name}</Text>
        <Text style={styles.text}>{"£ " + item.price}</Text>
      </View>
    </View>
  );

  if (!data) {
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
            latitude: data.restaurant.restaurant.Latitude,
            longitude: data.restaurant.restaurant.Longitude,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        >
          <Marker
            coordinate={{
              latitude: data.restaurant.restaurant.Latitude,
              longitude: data.restaurant.restaurant.Longitude,
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
              {data.restaurant.restaurant.RestaurantName}
            </Text>
            <Text style={styles.text}>
              {data.restaurant.restaurant.RestaurantDescription}
            </Text>
            <TouchableOpacity
              onPress={() => {
                const url = `tel:${data.restaurant.restaurant.Phone}`;
                Linking.canOpenURL(url).then((supported) => {
                  // If we can open the telephone url
                  if (supported) return Linking.openURL(url);
                  // else copy the number to clipboard
                  Clipboard.setString(data.restaurant.restaurant.Phone);
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
                Telephone: {data.restaurant.restaurant.Phone}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                let daddr = encodeURIComponent(
                  `${data.restaurant.restaurant.Street1} ${data.restaurant.restaurant.Postcode}`
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
            <Text style={styles.text}>
              Item{data.items.length > 1 ? "s" : ""} you've liked from this
              restaurant
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View
                style={{
                  marginLeft: 20,
                  marginTop: 10,
                  height: 300,
                  display: "flex",
                  flexDirection: "row",
                  marginBottom: 0,
                }}
              >
                {data.items.map((item) => renderItem(item))}
              </View>
            </ScrollView>
            <Text
              style={{
                fontSize: 20,
                paddingVertical: 10,
                paddingLeft: 25,

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
                  marginLeft: 25,
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
            <Text style={styles.text}>Party Size</Text>
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
                if (data.restaurant.restaurant.WebhookURI) {
                  // Need a way to get the user's email
                  const res = await fetch(
                    data.restaurant.restaurant.WebhookURI,
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
});
export default MatchedScreen;
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
