import React from "react";
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

  function onDataChange(newMembers: SocketUser[]) {
    setMembers(newMembers);
  }
  // Subscribe on mount
  React.useEffect(() => {
    observer.subscribeToJoin(onDataChange);
  }, []);

  const [code, setCode] = React.useState<number>();
  const [page, setPage] = React.useState<Page>(Page.join_create);
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
      return <GroupPage setPage={setPage} />;
    case Page.waiting:
      return (
        <GroupWaitingRoom
          setPage={setPage}
          isHost={true}
          roomCode={"*ROOM CODE*"}
          members={members}
        />
      );
    case Page.map_view:
      return (
        <SelectLocation
          isGroup
          onSave={() => {
            setPage(Page.swipe);
          }}
          setPage={setPage}
        />
      );
  }
  return null;
};

export default GroupPageRouter;
