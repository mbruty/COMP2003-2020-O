import React from "react";
import { Image, StyleSheet, Text, View, Dimensions } from "react-native";

import data from "./data";
import Swiper from "react-native-deck-swiper";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import SwipeCard from "./SwipeCard";
import { TouchableOpacity } from "react-native-gesture-handler";
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
  const onSwiped = () => {
    setIndex((index + 1) % data.length);
  };

  return (
    <View style={styles.container}>
      <View style={styles.swiperContainer}>
        <Swiper
          ref={swiperRef}
          cards={data}
          cardIndex={index}
          renderCard={(card) => (
            <SwipeCard
              items={card.tags}
              title={card.name}
              imageURI={card.image}
            />
          )}
          backgroundColor={"transparent"}
          onSwiped={onSwiped}
          onTapCard={() => null}
          cardVerticalMargin={50}
          stackSize={stackSize}
          stackScale={10}
          stackSeparation={14}
          animateOverlayLabelsOpacity
          animateCardOpacity
          disableTopSwipe
          disableBottomSwipe
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
                  backgroundColor: colors.blue,
                  borderColor: colors.blue,
                  color: colors.white,
                  borderWidth: 1,
                  fontSize: 24,
                },
                wrapper: {
                  flexDirection: "column",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  marginTop: 20,
                  marginLeft: 20,
                },
              },
            },
          }}
        />
      </View>
      <View style={styles.bottomContainer}>
        <View style={styles.bottomContainerButtons}>
          <TouchableOpacity
            onPress={() => swiperRef.current.swipeLeft()}
            style={[styles.btn, { marginRight: 20 }]}
          >
            <MaterialCommunityIcons.Button
              name="close"
              size={50}
              backgroundColor="transparent"
              underlayColor="transparent"
              activeOpacity={0.3}
              style={{ paddingLeft: 14 }}
              color={colors.red}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.btn}
            onPress={() => swiperRef.current.swipeRight()}
          >
            <AntDesign.Button
              name="heart"
              size={35}
              backgroundColor="transparent"
              style={{ paddingLeft: 20 }}
              underlayColor="transparent"
              activeOpacity={0.3}
              color={colors.green}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  swiperContainer: {
    flex: 1,
    marginTop: -30,
    zIndex: 2,
  },
  bottomContainer: {
    display: "flex",
    position: "absolute",
    top: height - 230,
    left: width / 2 - 90,
  },
  bottomContainerMeta: { alignContent: "flex-end", alignItems: "center" },
  bottomContainerButtons: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
  done: {
    textAlign: "center",
    fontSize: 30,
    color: colors.white,
    backgroundColor: "transparent",
  },
  btn: {
    display: "flex",
    justifyContent: "center",
    width: 80,
    height: 80,
    backgroundColor: "#FFF",
    borderRadius: 50,
    borderColor: "#AAA",
    borderWidth: 1,
  },
});
