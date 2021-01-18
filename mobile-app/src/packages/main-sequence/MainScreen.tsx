import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RecentVisits from "./RecentVisits";
import Nav from "./Nav";
import AnimatedSwipe from "../SwipeCard/AnimatedSwipe";
import SmartPage from "react-native-smart-page";
import { CONSTANT_COLOURS } from "../../constants";

interface Props {}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  screen: {
    height: height,
    width: width,
    backgroundColor: CONSTANT_COLOURS.BG_BASE
  },
});

let scrollRef = React.createRef<ScrollView | undefined>();

const MainScreen: React.FC<Props> = (props) => {
  const [pageIdx, setPageIdx] = useState<number>(0);
  const setPage = (index: number) => {
    console.log(scrollRef);
    pageRef.current.flingToPage(index, 0.99);
    // If you don't know about the setTimeout 0 trick and why it's needed
    // Please educate yourself on it before touching this
    setTimeout(() => setPageIdx(index), 0);
  };

  const pageRef = React.createRef();

  return (
    <>
      <Nav setPage={setPage} selectedIdx={pageIdx} />
      <SmartPage
        loadMinimal={false}
        ref={pageRef}
        onPageSelected={(index: number) => {
          setPageIdx(index);
        }}
        sensitiveScroll={false}
      >
        <View style={styles.screen}>
          <AnimatedSwipe />
        </View>
        <View style={styles.screen}></View>
        <View style={styles.screen}>
          <RecentVisits
            restaurants={[
              {
                index: 0,
                name: "The Bruty's Arms",
                type: 0,
                visitDate: "25-12-2020",
              },
            ]}
          />
        </View>
        <View style={styles.screen}></View>
      </SmartPage>
    </>
  );
};

export default MainScreen;
