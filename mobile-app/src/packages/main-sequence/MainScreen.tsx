import React, { useState } from "react";
import { Dimensions, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RecentVisits from "./RecentVisits";
import Nav from "./Nav";

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
    backgroundColor: "#fafafa",
    borderColor: "#aaaaaa",
    borderWidth: 2,
  },
});

let scrollRef = React.createRef<ScrollView | undefined>();

const MainScreen: React.FC<Props> = (props) => {
  const [pageIdx, setPageIdx] = useState<number>(0);
  const setPage = (index: number) => {
    console.log(scrollRef);
    scrollRef.current.scrollTo({ x: index * width, y: 0, animated: true });
    // If you don't know about the setTimeout 0 trick and why it's needed
    // Please educate yourself on it before touching this
    setTimeout(() => setPageIdx(index), 0);
  };

  return (
    <>
      <Nav setPage={setPage} selectedIdx={pageIdx} />
      <ScrollView
        ref={scrollRef}
        onMomentumScrollEnd={(e) =>
          setPageIdx(Math.ceil(e.nativeEvent.contentOffset.x / width))
        }
        showsHorizontalScrollIndicator={false}
        disableIntervalMomentum={true}
        snapToInterval={width}
        decelerationRate="fast"
        horizontal={true}
        style={styles.container}
      >
        <View style={styles.screen}></View>
        <View style={styles.screen}></View>
        <View style={styles.screen}>
          <RecentVisits restaurantDetails={[{index: 1, type: 0, restaurantName: "Restaurant 1", restaurantVisitDate: "09-11-20"}, {index: 2, type: 1, restaurantName: "Restaurant 2", restaurantVisitDate: "15-11-20"}]}/>
        </View>
        <View style={styles.screen}></View>
      </ScrollView>
    </>
  );
};

export default MainScreen;
