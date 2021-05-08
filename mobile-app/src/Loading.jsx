import React from "react";
import { Dimensions, Image, View } from "react-native";
import Animated, { Easing, stopClock } from "react-native-reanimated";
import { CONSTANT_COLOURS } from "./constants";
const {
  useCode,
  block,
  set,
  Value,
  Clock,
  eq,
  clockRunning,
  not,
  or,
  defined,
  cond,
  startClock,
  timing,
  interpolate,
  and,
  add,
  greaterOrEq
} = Animated;

const delay = (clock, time, node, nodeBefore = 0, reset = new Value(0)) => {
  const when = new Value();
  return block([
    cond(or(not(defined(when)), reset), [
      set(when, add(clock, time)),
      set(reset, 0),
    ]),
    cond(greaterOrEq(clock, when), node, nodeBefore),
  ]);
};

const runTiming = (clock) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1400,
    toValue: 1,
    easing: Easing.linear,
  };

  return block([
    // we run the step here that is going to update position
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config)
    ),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.position, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),
    state.position,
  ]);
};

const runTimingDelayed = (clock) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    time: new Value(0),
    frameTime: new Value(0),
  };

  const config = {
    duration: 1400,
    toValue: 1,
    easing: Easing.linear,
  };

  return block([
    delay(clock, timing(clock, state, config), 700),
    // we run the step here that is going to update position
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config)
    ),
    cond(eq(state.finished, 1), [
      set(state.finished, 0),
      set(state.position, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),
    state.position,
  ]);
};

const { width } = Dimensions.get("window");
export const Loading = () => {
  const { progress, delayed, clock, isPlaying, delayedClock } = React.useMemo(
    () => ({
      progress: new Value(0),
      delayed: new Value(0),
      isPlaying: new Value(1),
      clock: new Clock(),
      delayedClock: new Clock(),
    }),
    []
  );

  useCode(
    () =>
      block([
        cond(
          and(not(clockRunning(clock)), eq(isPlaying, 1)),
          startClock(clock)
        ),
        cond(and(clockRunning(clock), eq(isPlaying, 0)), stopClock(clock)),
        set(progress, runTiming(clock)),
      ]),
    [progress, clock]
  );

  useCode(
    () =>
      block([
        cond(
          and(not(clockRunning(clock)), eq(isPlaying, 1)),
          startClock(delayedClock)
        ),
        cond(
          and(clockRunning(delayedClock), eq(isPlaying, 0)),
          stopClock(delayedClock)
        ),
        set(delayed, runTimingDelayed(delayedClock)),
      ]),
    [delayed, delayedClock]
  );

  const interpolatedWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [width / 2, width / 1.1],
  });

  const interpolatedOpcaity = progress.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 0],
  });

  const delayedWidth = delayed.interpolate({
    inputRange: [0, 1],
    outputRange: [width / 3, width / 1.1],
  });

  const animatedStyle = {
    width: interpolatedWidth,
    height: interpolatedWidth,
    borderWidth: 8,
    opacity: interpolatedOpcaity,
    borderColor: CONSTANT_COLOURS.RED,
    borderRadius: 500,
    marginLeft: "auto",
    marginRight: "auto",
    marginTop: "auto",
    marginBottom: "auto",
  };

  const delayedStyle = {
    width: delayedWidth,
    height: delayedWidth,
    borderWidth: 8,
    opacity: 1,
    borderColor: CONSTANT_COLOURS.RED,
    borderRadius: 500,
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
        {/* <Animated.View style={delayedStyle} /> */}
      </View>
    </View>
  );
};
