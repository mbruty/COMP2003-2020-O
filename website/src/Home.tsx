import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { API_URL } from "./constants";
import "./styles/grid.scss";
import RecentSwipeStats from "./widgets/RecentSwipeStats";
import LongTermSwipeStats from "./widgets/LongTermSwipeStats";

export enum Widgets {
  RecentSwipeStats,
  LongTermSwipeStats,
}
const Home: React.FC = (props) => {
  const history = useHistory();
  useEffect(() => {
    fetch(API_URL + "/authcheck", {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then((response) => {
      if (response.status === 401) {
        history.push("/log-in");
      }
    });
  }, [history]);

  const widgets = [
    Widgets.RecentSwipeStats,
    Widgets.LongTermSwipeStats,
  ];

  const renderWidget = (which: Widgets, index: number) => {
    switch (which) {
      case Widgets.RecentSwipeStats:
        return <RecentSwipeStats index={index} />;
      case Widgets.LongTermSwipeStats:
        return <LongTermSwipeStats index={index} />;
    }
  };
  return (
    <div className="grid">
      {widgets.map((widget, index) => renderWidget(widget, index))}
    </div>
  );
};

export default Home;
