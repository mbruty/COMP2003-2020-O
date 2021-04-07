import React from "react";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";

import data from "./data";
import Swiper from "react-native-deck-swiper";
import { Feather as Icon } from "@expo/vector-icons";
import SwipeCard from "./SwipeCard";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Loading } from "../../Loading";
import { includeAuth } from "../includeAuth";

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

export default function App() {
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(false);

  const onSwiped = async (side, id, isFavourite) => {
    const auth = await includeAuth();
    // Send to python api
    const res = await fetch("http://127.0.0.1:5000/swipe", {
      method: "POST",
      body: JSON.stringify({
        foodid: id,
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
    console.log(res.status);
    setIndex((prevIdx) => (prevIdx + 1) % data.length);
  };

  const onDone = () => {
    //ToDo:
    //Fetch some more data from the recommender
    setLoading(true);
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={{ marginTop: "-20%" }}>
          <Loading />
        </View>
      ) : (
        <Swiper
          ref={swiperRef}
          cards={data}
          cardIndex={index}
          renderCard={(card) => (
            <SwipeCard foodID={card.foodid} title={card.name} />
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
