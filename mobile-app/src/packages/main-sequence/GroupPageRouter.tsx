import React from "react";
import GroupPage from "./GroupPage";
import SelectLocation from "./SelectLocation";

interface Props {

}

export enum Page {
  join_create,
  map_view,
  swipe
}

const GroupPageRouter: React.FC<Props> = (props) => {
  const [page, setPage] = React.useState<Page>(Page.join_create);
  switch (page) {
    case Page.join_create:
      return <GroupPage setPage={setPage} />
    case Page.map_view:
      return <SelectLocation setPage={setPage} />;
  }
  return null;
}

export default GroupPageRouter;