import React from "react";
import { LatLng } from "react-native-maps";
import { auth, includeAuth } from "../includeAuth";
import { GroupObserver, SocketUser } from "./GroupObserver";
import GroupPage from "./GroupPage";
import GroupWaitingRoom from "./GroupWaitingRoom";
import SelectLocation from "./SelectLocation";

interface Props {
  setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  scrollEnabled: boolean;
  auth: auth;
}

export enum Page {
  join_create,
  map_view,
  swipe,
  waiting,
}

const GroupPageRouter: React.FC<Props> = (props) => {
  const [members, setMembers] = React.useState<SocketUser[]>();
  const [code, setCode] = React.useState<number>(0);
  const [page, setPage] = React.useState<Page>(Page.join_create);
  const [isHost, setIsHost] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string>("");
  // Create the observer on mount
  const observer = React.useMemo(() => {
    if (props.auth && props.auth.userid) {
      const observer = new GroupObserver(props.auth.userid);
      observer.subscribe(async (newMembers, newCode) => {
        try {
          console.log("newMembers", newMembers);

          // Select the user in the array that is the owner
          const owner = newMembers?.filter((user) => user.owner)[0];
          console.log("owner", owner);
          console.log(newCode);

          // If the owner's userid and this user's id match, they are the owner!
          const isOwner = owner && props.auth.userid == owner.id;
          if (isHost !== isOwner) {
            setIsHost(isOwner);
          }

          if (newCode === -1) {
            alert("Leaving");
            setCode(0);
            setPage(Page.join_create);
          } else if (newCode !== code) {
            // Code has changed!
            setCode(newCode);
            setPage(Page.waiting);
          }
          setMembers([...newMembers]);
        } catch (e) {
          console.log(e);
        }
      });

      observer.onError = () => {
        setError(
          "That group doesn't exist, please check the code and try again"
        );
        setPage(Page.join_create);
        setTimeout(() => setError(""), 5000);
      };
      return observer;
    }
  }, [props.auth]);

  if (page !== Page.map_view && !props.scrollEnabled) {
    props.setScrollEnabled(true);
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
          onJoin={(code) => observer.join(code)}
          setPage={setPage}
        />
      );
    case Page.waiting:
      return (
        <GroupWaitingRoom
          observer={observer}
          setPage={setPage}
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
  }
  return null;
};

export default GroupPageRouter;
