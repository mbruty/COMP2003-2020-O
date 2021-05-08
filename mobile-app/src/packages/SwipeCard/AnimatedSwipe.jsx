import React from "react";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import * as Location from "expo-location";
import Swiper from "react-native-deck-swiper";
import { Feather as Icon } from "@expo/vector-icons";
import SwipeCard from "./SwipeCard";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Loading } from "../../Loading";
import { includeAuth } from "../includeAuth";
import FoodItemView from "./FoodItemView";
import { AuthContext } from "../../AuthContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CONSTANT_COLOURS, RECOMMENDER_URL } from "../../constants";
const { height, width } = Dimensions.get("screen");
const stackSize = 4;
const colors = {
  red: "#EC2379",
  green: "#2fd86d",
  blue: "#0070FF",
  gray: "#777777",
  white: "#ffffff",
  black: "#000000",
};

const swiperRef = React.createRef();

export default function AnimatedSwipe(props) {
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [data, setData] = React.useState([]);
  const [text, setText] = React.useState();
  const [swipedOn, setSwipedOn] = React.useState();
  const auth = React.useContext(AuthContext);
  React.useEffect(() => {
    if (data.length === 0) {
      (async () => {
        const settings = JSON.parse(await AsyncStorage.getItem("location"));
        let requestObj = {
          userid: auth.userid,
          authtoken: auth.authtoken,
        };
        if (settings && !settings.toggle && settings.latlon) {
          // If settings isn't undefined AND if use current location is off AND we have an object for the selected latlon do...
          // Basically if we aren't using the current location, and we have a location to go off of
          requestObj.lat = settings.latlon.latitude;
          requestObj.lng = settings.latlon.longitude;
          requestObj.distance = settings.distance || 10; // The distance saved or 10 miles
        } else {
          // Use the current location
          // We've requested access to location elsewhere
          const userLocation = await Location.getCurrentPositionAsync({});
          if (!userLocation) {
            setLoading(true);
            setText(
              "Please enable location, or set a location to swipe in settings"
            );
            return;
          }
          requestObj.lat = userLocation.coords.latitude;
          requestObj.lng = userLocation.coords.longitude;
          if (settings && settings.distance) {
            requestObj.distance = settings.distance;
          } else {
            requestObj.distance = 10;
          }
        }
        try {
          const response = await fetch(RECOMMENDER_URL + "/swipestack", {
            method: "post",
            body: JSON.stringify(requestObj),
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          });
          console.log(response.status);
          if (response.status === 200) {
            const stack = await response.json();
            setData(stack);
            setLoading(false);
          } else if (response.status === 404) {
            setLoading(true);
            setText("No restaurants found within your specified distance");
          } else {
            console.log(response.status);
            console.log(await response.json());
          }
        } catch (e) {
          console.log(e);
        }
      })();
    }
  }, [loading, auth]);

  const onSwiped = async (side, idx, isFavourite) => {
    // Send to python api
    const item = data[idx];
    const res = await fetch(RECOMMENDER_URL + "/swipe", {
      method: "POST",
      body: JSON.stringify({
        foodid: item.FoodID,
        userid: auth.userid,
        authtoken: auth.authtoken,
        islike: side === "LIKE",
        isfavourite: isFavourite,
      }),
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (side === "LIKE") setSwipedOn(item);
    setIndex((prevIdx) => (prevIdx + 1) % data.length);
  };

  const onDone = () => {
    //ToDo:
    //Fetch some more data from the recommender
    setLoading(true);
    setText("Our robots are searching for more food to serve their master");
    setData([]);
  };

  if (swipedOn) {
    return (
      <FoodItemView
        itemId={swipedOn.FoodID}
        restaurantId={swipedOn.RestaurantID}
        onComplete={() => setSwipedOn(undefined)}
      />
    );
  }
  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ marginTop: "-20%" }}>
          <Loading />
          {text && (
            <Text
              style={{
                position: "absolute",
                width: "100%",
                top: "70%",
                textAlign: "center",
                fontSize: 20,
                color: CONSTANT_COLOURS.DARK_GREY,
              }}
            >
              {text}
            </Text>
          )}
        </View>
      ) : (
        <Swiper
          ref={swiperRef}
          cards={data}
          cardIndex={index}
          renderCard={(card) => (
            <SwipeCard
              foodID={card.FoodID}
              title={card.ShortName}
              price={card.Price}
            />
          )}
          backgroundColor={"transparent"}
          onSwipedLeft={(id) => onSwiped("NOPE", id, false)}
          onSwipedRight={(id) => onSwiped("LIKE", id, false)}
          onSwipedTop={(id) => onSwiped("", id, true)}
          onTapCard={() => null}
          stackSize={stackSize}
          stackScale={10}
          stackSeparation={14}
          animateOverlayLabelsOpacity
          animateCardOpacity
          disableBottomSwipe
          onSwipedAll={onDone}
          overlayLabels={{
            left: {
              title: "NOPE",
              style: {
                label: {
                  backgroundColor: colors.red,
                  borderColor: colors.red,
                  color: colors.white,
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-end",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: -20,
                },
              },
            },
            right: {
              title: "LIKE",
              style: {
                label: {
                  backgroundColor: colors.green,
                  borderColor: colors.green,
                  color: colors.white,
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginLeft: 20,
                  marginTop: 20,
                },
              },
            },
            top: {
              title: "FAVOURITE",
              style: {
                label: {
                  backgroundColor: "#1bd6f7",
                  borderColor: "#1bd6f7",
                  color: colors.white,
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  marginLeft: 20,
                },
              },
            },
          }}
        />
      )}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.circle}
          onPress={() => swiperRef.current.swipeLeft()}
        >
          <Icon name="x" size={32} color="#ec5288" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.circle}
          onPress={() => swiperRef.current.swipeTop()}
        >
          <Icon name="star" size={32} color="#1bd6f7" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.circle}
          onPress={() => swiperRef.current.swipeRight()}
        >
          <Icon name="heart" size={32} color="#6ee3b4" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    height: height - 100,
    position: "relative",
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
  footer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    padding: 16,
    position: "absolute",
    width: width,
    bottom: 50,
  },
  circle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    padding: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
    shadowColor: "gray",
    shadowOffset: { width: 1, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 2,
  },
});
