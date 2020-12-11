import React from "react";
import { Dimensions } from "react-native";
import Animated from "react-native-reanimated";
import { PanGestureHandler, State } from "react-native-gesture-handler";
import { Transition, Transitioning } from "react-native-reanimated";
const { width } = Dimensions.get("window");
import Card, { CARD_WIDTH } from "./Card";
const { cond, eq, add, call, set, Value, event, or } = Animated;

export default class AnimatedCard extends React.Component {
  constructor(props) {
    super(props);
    this.handleSwipe = props.onSwipe;
    this.cardIdx = props.index;
    this.dragX = new Value(0);
    this.absoluteX = new Value(0);
    this.offsetX = new Value(width / 2 - CARD_WIDTH / 2);
    this.gestureState = new Value(-1);
    this.onGestureEvent = event([
      {
        nativeEvent: {
          state: this.gestureState,
          translationX: this.dragX,
        },
      },
    ]);

    this.state = { x: 0 };
    this.transX = cond(
      eq(this.gestureState, State.ACTIVE),
      add(this.offsetX, this.dragX),
      set(this.offsetX, add(this.offsetX, this.dragX))
    );
    this.ref = React.createRef();
  }

  moving = ([x]) => {
    this.setState({ x });
  };

  done = ([]) => {
    console.log("done");
    if (this.state.x < 140) {
      this.dragX.setValue(0);
      this.absoluteX.setValue(0);
      this.offsetX.setValue(width / 2 - CARD_WIDTH / 2);
      this.gestureState.setValue(-1);
      this.ref.current.animateNextTransition();
    } else {
      // Open the thingy
      this.handleSwipe(this.cardIdx);
    }
  };

  transition = (
    <Transition.Together>
      <Transition.In
        type="slide-right"
        durationMs={500}
        interpolation="easeInOut"
      />
      <Transition.In type="fade" durationMs={2000} />
      <Transition.Change />
      <Transition.Out type="fade" duration={2000} />
    </Transition.Together>
  );

  render() {
    return (
      <Transitioning.View ref={this.ref} transition={this.transition}>
        <Animated.Code>
          {() =>
            cond(
              eq(this.gestureState, State.ACTIVE),
              call([this.transX], this.moving)
            )
          }
        </Animated.Code>
        <Animated.Code>
          {() =>
            cond(
              or(
                eq(this.gestureState, State.END),
                eq(this.gestureState, State.FAILED),
                eq(this.gestureState, State.CANCELLED)
              ),
              call([], this.done)
            )
          }
        </Animated.Code>
        <PanGestureHandler
          maxPointers={1}
          onGestureEvent={this.onGestureEvent}
          onHandlerStateChange={this.onGestureEvent}
          activeOffsetX={[-10, 10]}
        >
          <Animated.View
            style={{
              transform: [
                {
                  translateX: this.transX,
                },
              ],
            }}
          >
            <Card
              type={this.props.type}
              name={this.props.name}
              nextVisit={this.props.nextVisit}
            />
          </Animated.View>
        </PanGestureHandler>
      </Transitioning.View>
    );
  }
}
