import React from "react";
import { Dimensions, Easing, Image, View } from "react-native";
import Animated from "react-native-reanimated";
import { CONSTANT_COLOURS } from "./constants";

const { width } = Dimensions.get("window");
export const Loading = () => {
  const animatedValue = new Animated.Value(0);
  const delayedValue = new Animated.Value(1);
  React.useEffect(() => {
    startAnimation();
    const interval = setInterval(startAnimation, 2800);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const startAnimation = () => {
    animatedValue.setValue(0);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 1400,
      easing: Easing.linear,
    }).start();

    setTimeout(() => {
      delayedValue.setValue(0);
      Animated.timing(delayedValue, {
        toValue: 1,
        duration: 1400,
        easing: Easing.linear,
      }).start();
    }, 700);
  };

  const interpolatedWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width / 2, width / 1.1],
  });

  const interpolatedOpacity = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const delayedInterpolatedWidth = delayedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [width / 2, width / 1.1],
  });

  const delayedInterpolatedOpacity = delayedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });
  const animatedStyle = {
    width: interpolatedWidth,
    height: interpolatedWidth,
    borderWidth: 8,
    opacity: interpolatedOpacity,
    borderColor: CONSTANT_COLOURS.RED,
    borderRadius: "1000%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  };

  const delayedAnimatedStyle = {
    width: delayedInterpolatedWidth,
    height: delayedInterpolatedWidth,
    borderWidth: 8,
    opacity: delayedInterpolatedOpacity,
    borderColor: CONSTANT_COLOURS.RED,
    borderRadius: "1000%",
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  };
  return (
    <View
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
      }}
    >
      <Image
        source={require("./resources/Logo.png")}
        // Why Mr. React native do you not allow margin: "auto" to work and make me do this abomination to the CSS gods
        style={{
          width: "50%",
          marginLeft: "auto",
          marginRight: "auto",
          marginTop: "auto",
          marginBottom: "auto",
        }}
        resizeMode="contain"
      />
      <View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          display: "flex",
        }}
      >
        <Animated.View style={animatedStyle} />
      </View>
      <View
        style={{
          position: "absolute",
          height: "100%",
          width: "100%",
          display: "flex",
        }}
      >
        <Animated.View style={delayedAnimatedStyle} />
      </View>
    </View>
  );
};
