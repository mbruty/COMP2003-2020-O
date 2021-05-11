import { Foundation, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useEffect } from "react";
import {
  Dimensions,
  KeyboardAvoidingView,
  Linking,
  Platform,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { TextInput, TouchableOpacity } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { API_URL, CONSTANT_COLOURS, IMG_URL } from "../../constants";
import Clipboard from "expo-clipboard";
import DatePicker from "@react-native-community/datetimepicker";

interface Props {
  itemId: number;
  onComplete: () => void;
  restaurantId: number;
}

const FoodItemView: React.FC<Props> = (props) => {
  const [restaurantData, setRestaurantData] = React.useState<
    RequestObj | undefined
  >();
  const [size, setSize] = React.useState<number>(1);
  const [date, setDate] = React.useState<Date>(new Date());

  useEffect(() => {
    (async () => {
      const res = await fetch(API_URL + "/restaurant/" + props.restaurantId);
      const data: RequestObj = await res.json();
      setRestaurantData(data);
    })();
  }, []);

  if (!restaurantData) {
    return <Text>Loading...</Text>;
  }

  const handleSizeChange = (e: number) => {
    if (e < 1) {
      setSize(1);
    } else {
      setSize(e);
    }
  };

  return (
    <View
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <MapView
        style={styles.map}
        compassOffset={{
          x: 0,
          y: 25,
        }}
        rotateEnabled={false}
        scrollEnabled={false}
        showsUserLocation={true}
        region={{
          latitude: restaurantData.restaurant.Latitude,
          longitude: restaurantData.restaurant.Longitude,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        <Marker
          coordinate={{
            latitude: restaurantData.restaurant.Latitude,
            longitude: restaurantData.restaurant.Longitude,
          }}
        />
      </MapView>
      <TouchableOpacity
        style={{
          marginTop: 15,
          marginLeft: 15,
          backgroundColor: "white",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderRadius: 100,
          width: 40,
        }}
        onPress={() => {
          props.onComplete();
        }}
      >
        <MaterialCommunityIcons
          name="keyboard-backspace"
          size={24}
          color="black"
        />
      </TouchableOpacity>
      <KeyboardAvoidingView
        style={{ marginTop: "70%", width: "100%" }}
        behavior="position"
      >
        <View
          style={{
            padding: 25,
            paddingBottom: 50,
            width: "100%",
            borderTopRightRadius: 25,
            borderTopLeftRadius: 25,
            backgroundColor: "white",
            borderColor: CONSTANT_COLOURS.DARK_GREY,
            borderWidth: 1,
            display: "flex",
          }}
        >
          <Text
            style={{
              fontSize: 30,
              fontWeight: "bold",
              color: CONSTANT_COLOURS.DARK_GREY,
            }}
          >
            {restaurantData.restaurant.RestaurantName}
          </Text>
          <Text style={styles.text}>
            {restaurantData.restaurant.RestaurantDescription}
          </Text>
          <TouchableOpacity
            onPress={() => {
              const url = `tel:${restaurantData.restaurant.Phone}`;
              Linking.canOpenURL(url).then((supported) => {
                // If we can open the telephone url
                if (supported) return Linking.openURL(url);
                // else copy the number to clipboard
                Clipboard.setString(restaurantData.restaurant.Phone);
                alert("Phone number coppied to clipboard");
              });
            }}
            style={{
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
              Telephone: {restaurantData.restaurant.Phone}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              let daddr = encodeURIComponent(
                `${restaurantData.restaurant.Street1} ${restaurantData.restaurant.Postcode}`
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
              color: CONSTANT_COLOURS.DARK_GREY,
            }}
          >
            Make a booking
          </Text>
          <DatePicker
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
              if (restaurantData.restaurant.WebhookURI) {
                // Need a way to get the user's email
                const res = await fetch(restaurantData.restaurant.WebhookURI, {
                  method: "POST",
                  body: JSON.stringify({
                    dateTime: date,
                    partySize: size,
                    email: null,
                  }),
                });
                if (res.status === 200) {
                  props.onComplete();
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
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
    height: "40%",
  },
  text: {
    color: CONSTANT_COLOURS.DARK_GREY,
    paddingTop: 10,
    fontSize: 15,
  },
});

export default FoodItemView;

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
