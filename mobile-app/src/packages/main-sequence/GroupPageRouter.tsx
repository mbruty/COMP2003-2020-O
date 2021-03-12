import React from "react";
import GroupPage from "./GroupPage";
import SelectLocation from "./SelectLocation";

interface Props {
  setScrollEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  scrollEnabled: boolean;
}

export enum Page {
  join_create,
  map_view,
  swipe
}

const GroupPageRouter: React.FC<Props> = (props) => {
  const [page, setPage] = React.useState<Page>(Page.join_create);
  if(page !== Page.map_view && !props.scrollEnabled) {
    props.setScrollEnabled(true);
  }
  React.useEffect(() => {
    if(page === Page.map_view && props.scrollEnabled) {
      setPage(Page.join_create);
    }  
  }, [props.scrollEnabled])
  switch (page) {
    case Page.join_create:
      return <GroupPage setPage={setPage} />
    case Page.map_view:
      return <SelectLocation isGroup onSave={() => {
        setPage(Page.swipe);
      }} setPage={setPage} />;
  }
  return null;
}

export default GroupPageRouter;