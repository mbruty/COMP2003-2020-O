import React, { useEffect, useState } from "react";
import { Dimensions, SectionList, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import RecentVisits from "./RecentVisits";
import Settings from "./Settings";
import GroupPage from "./GroupPage";
import Nav from "./Nav";
import AnimatedSwipe from "../SwipeCard/AnimatedSwipe";
import SmartPage from "react-native-smart-page";
import { CONSTANT_COLOURS } from "../../constants";
import getUserInfo from "../requests/getUserInfo";
import GroupPageRouter from "./GroupPageRouter";
import { AuthContext } from "../../AuthContext";

interface Props {
  logOut: () => void;
}

const { height, width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  screen: {
    height: height,
    width: width,
    backgroundColor: CONSTANT_COLOURS.BG_BASE,
  },
});

let scrollRef = React.createRef<ScrollView | undefined>();

const MainScreen: React.FC<Props> = (props) => {
  const [user, setUser] = useState();
  const [scrollEnabled, setScrollEnabled] = React.useState<boolean>(true);
  const [pageIdx, setPageIdx] = useState<number>(0);

  const disableScroll = () => {
    // Doing it like this to prevent re-render's if the scroll is already disabled
    if (scrollEnabled) {
      setScrollEnabled(false);
    }
  };

  const setPage = (index: number) => {
    console.log(scrollRef);
    // @ts-ignore
    pageRef.current.flingToPage(index, 0.99);
    // If you don't know about the setTimeout 0 trick and why it's needed
    // Please educate yourself on it before touching this
    setTimeout(() => setPageIdx(index), 0);
  };

  useEffect(() => {
    getUserInfo();
  }, []);
  const pageRef = React.createRef();

  useEffect(() => {
    if (pageIdx === 0) {
      setScrollEnabled(true);
    } else {
      setScrollEnabled(false);
    }
  }, [pageIdx]);

  const lockScroll = () => {
    setScrollEnabled(false);
  };

  const unlockScroll = () => {
    setScrollEnabled(false);
  };
  return (
    <AuthContext.Consumer>
      {(auth) => (
        <>
          <Nav setPage={setPage} selectedIdx={pageIdx} />
          <SmartPage
            loadMinimal={false}
            ref={pageRef}
            onPageSelected={(index: number) => {
              setPageIdx(index);
            }}
            sensitiveScroll={false}
            scrollEnabled={scrollEnabled}
          >
            <View style={styles.screen}>
              <AnimatedSwipe
                key="SoloSwipe"
                lockScroll={lockScroll}
                auth={auth}
                isGroup={false}
                unlockScroll={unlockScroll}
              />
            </View>
            <View style={styles.screen}>
              <GroupPageRouter
                auth={auth}
                lockScroll={lockScroll}
                setScrollEnabled={setScrollEnabled}
                scrollEnabled={scrollEnabled}
              />
            </View>
            <View style={styles.screen}>
              <RecentVisits
                restaurants={[
                  {
                    index: 0,
                    id: 1,
                    name: "The Bruty's Arms",
                    type: 0,
                    visitDate: "12-05-2021",
                  },
                  {
                    index: 1,
                    id: 6,
                    name: "Thai Tanic",
                    type: 1,
                    visitDate: "06-05-2021",
                  },
                  {
                    index: 2,
                    id: 2,
                    name: "Admiral Acbar's Sushi",
                    type: 0,
                    visitDate: "04-05-2021",
                  },
                  {
                    index: 3,
                    id: 5,
                    name: "The Kingdom of Spamalot",
                    type: 1,
                    visitDate: "25-04-2021",
                  },
                  {
                    index: 4,
                    id: 4,
                    name: "Dexter's Diner",
                    type: 0,
                    visitDate: "18-04-2021",
                  },
                  {
                    index: 5,
                    name: "Pizza Xpress",
                    id: 7,
                    type: 1,
                    visitDate: "5-04-2021",
                  },
                ]}
              />
            </View>
            <View style={styles.screen}>
              <Settings
                scrollEnabled={scrollEnabled}
                setScrollEnabled={setScrollEnabled}
                logOut={props.logOut}
              />
            </View>
          </SmartPage>
        </>
      )}
    </AuthContext.Consumer>
  );
};

export default MainScreen;
