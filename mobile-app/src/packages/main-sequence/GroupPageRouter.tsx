import React from "react";
import { LatLng } from "react-native-maps";
import { GroupObserver, SocketUser } from "./GroupObserver";
import GroupPage from "./GroupPage";
import GroupWaitingRoom from "./GroupWaitingRoom";
import SelectLocation from "./SelectLocation";

interface Props {
  setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  scrollEnabled: boolean;
}

export enum Page {
  join_create,
  map_view,
  swipe,
  waiting,
}

const GroupPageRouter: React.FC<Props> = (props) => {
  // Create the observer on mount
  const observer = React.useMemo(() => new GroupObserver(), []);

  const [members, setMembers] = React.useState<SocketUser[]>();
  const [code, setCode] = React.useState<number>(0);
  const [page, setPage] = React.useState<Page>(Page.join_create);
  const [isHost, setIsHost] = React.useState<boolean>(false);

  // Subscribe on mount
  React.useEffect(() => {
    observer.subscribe((newMembers, newCode) => {
      
      if(page !== Page.swipe) {
        setPage(Page.waiting)
      }
      setMembers(newMembers)
      if(newCode !== code) {
        // Code has changed!
        setCode(newCode);
        setPage(Page.waiting)
      }
    });

  }, []);

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
      return <GroupPage onJoin={(code) => observer.join(code)} setPage={setPage} />;
    case Page.waiting:
      return (
        <GroupWaitingRoom
          setPage={setPage}
          isHost={isHost}
          roomCode={code}
          members={members}
        />
      );
    case Page.map_view:
      return (
        <SelectLocation
          isGroup
          onSave={(location: LatLng, distance: number) => {
            observer.create(location, distance)
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
