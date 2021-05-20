import { MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { PickerIOSComponent, Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { LatLng } from "react-native-maps";
import { CONSTANT_COLOURS } from "../../constants";
import { auth, includeAuth } from "../includeAuth";
import { GroupObserver, Page, SocketUser } from "./GroupObserver";
import GroupPage from "./GroupPage";
import GroupWaitingRoom from "./GroupWaitingRoom";
import SelectLocation from "./SelectLocation";
import AnimatedSwipe from "../SwipeCard/AnimatedSwipe";
import MatchedScreen from "./MatchedScreen";
interface Props {
  setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  scrollEnabled: boolean;
  auth: auth;
  lockScroll: () => void;
}

const GroupPageRouter: React.FC<Props> = (props) => {
  const [members, setMembers] = React.useState<SocketUser[]>();
  const [code, setCode] = React.useState<number>(0);
  const [page, setPage] = React.useState<Page>(Page.join_create);
  const [isHost, setIsHost] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  const [restuarantID, setRestaurantID] = React.useState<number>();
  // Create the observer on mount
  const observer = React.useMemo(() => {
    if (props.auth && props.auth.userid) {
      const observer = new GroupObserver(props.auth.userid);
      observer.subscribe(async (newMembers, newCode, newPage, restaurantID) => {
        try {
          // Select the user in the array that is the owner
          const owner = newMembers?.filter((user) => user.owner)[0];
          // If the owner's userid and this user's id match, they are the owner!
          const isOwner = owner && props.auth.userid == owner.id;
          if (restaurantID) {
            setRestaurantID(restaurantID);
          }
          if (isHost !== isOwner) {
            setIsHost(isOwner);
          }
          if (newCode === -1) {
            setCode(0);
          } else if (newCode !== code) {
            // Code has changed!
            setCode(newCode);
          }
          if (Array.isArray(newMembers)) setMembers([...newMembers]);
          if (page !== newPage) setPage(newPage);
        } catch (e) {
          console.log(e);
        }
      });

      observer.onError = (message: string) => {
        setError(message);
        setPage(Page.join_create);
        setTimeout(() => setError(""), 5000);
      };
      return observer;
    }
  }, [props.auth]);

  if (page === Page.matched && props.scrollEnabled) {
    props.lockScroll();
  }

  React.useEffect(() => {
    if (page === Page.map_view && props.scrollEnabled) {
      setPage(Page.join_create);
    }
  }, [props.scrollEnabled]);

  switch (page) {
    case Page.join_create:
      return (
        <GroupPage
          error={error}
          observer={observer}
          onJoin={(code) => observer.join(code)}
        />
      );
    case Page.waiting:
      return (
        <GroupWaitingRoom
          observer={observer}
          isHost={isHost}
          roomCode={code}
          members={members}
          onReady={() => {
            observer.toggleReady();
          }}
        />
      );
    case Page.map_view:
      return (
        <SelectLocation
          isGroup
          onSave={(location: LatLng, distance: number) => {
            observer.create(location, distance);
            setPage(Page.waiting);
            setIsHost(true);
          }}
          setPage={setPage}
        />
      );
    case Page.swipe:
      return (
        <>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              borderColor: "blac",
            }}
          >
            <TouchableOpacity
              style={{
                marginTop: 10,
                backgroundColor: "white",
                paddingHorizontal: 10,
                paddingVertical: 10,
                borderRadius: 100,
                display: "flex",
                width: 140,
                flexDirection: "row",
                marginLeft: 15,
              }}
              onPress={() => {
                observer.leave();
              }}
            >
              <MaterialCommunityIcons
                name="keyboard-backspace"
                size={24}
                color="black"
              />
              <Text style={{ paddingLeft: 10, paddingTop: 3 }}>
                Leave Group
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 18,
                color: CONSTANT_COLOURS.DARK_GREY,
                marginTop: 20,
                marginRight: 15,
              }}
            >
              Swiping in group {code}
            </Text>
          </View>
          <View>
            <AnimatedSwipe
              isGroup={true}
              key="GroupSwipe"
              code={code}
              onSwipe={(side: string, isFavourite: boolean, item) => {
                console.log(item);
                const isLike = side === "LIKE" || isFavourite;
                observer.onSwipe(item.RestaurantID, item.FoodID, isLike);
              }}
            />
          </View>
        </>
      );
    case Page.matched:
      return (
        <MatchedScreen
          onClose={() => null}
          isGroup={true}
          auth={props.auth}
          restaurantId={restuarantID}
          roomCode={code}
        />
      );
  }
  return null;
};

export default GroupPageRouter;
