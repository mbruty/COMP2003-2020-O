import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { API_URL } from "./constants";
import "./styles/grid.scss";
import RecentSwipeStats from "./dashboard/widgets/RecentSwipeStats";
import LongTermSwipeStats from "./dashboard/widgets/LongTermSwipeStats";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { Observer } from "./dashboard/WidgetObserver";
import update from "immutability-helper";
import TestWidget from "./dashboard/widgets/TestWidget";
import { Button, Paper, Theme, withStyles } from "@material-ui/core";
import AddWidget from "./dashboard/widgets/AddWidget";
import RemoveWidget from "./dashboard/widgets/RemoveWidget";
import { Edit, Save, UndoRounded } from "@material-ui/icons";

export enum Widgets {
  RecentSwipeStats,
  LongTermSwipeStats,
  TestWidget,
}

const allWidgets = [
  Widgets.RecentSwipeStats,
  Widgets.LongTermSwipeStats,
  Widgets.TestWidget,
];

const Home: React.FC<{ observer: Observer }> = (props) => {
  const history = useHistory();
  const [editing, setEditing] = React.useState<boolean>(false);
  const [widgets, setWidgets] = React.useState<Widgets[]>([]);

  useEffect(() => props.observer.subscribe(setWidgets), [props.observer]);

  useEffect(() => {
    fetch(API_URL + "/authcheck", {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then((response) => {
      if (response.status === 401) {
        // history.push("/log-in");
      }
    });
  }, [history]);

  const moveWidget = React.useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = widgets[dragIndex];
      props.observer.moveWidget(
        update(widgets, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [props.observer, widgets]
  );
  const renderWidget = (which: Widgets, index: number) => {
    switch (which) {
      case Widgets.RecentSwipeStats:
        return (
          <RecentSwipeStats
            index={index}
            moveWidget={moveWidget}
            id={Widgets.RecentSwipeStats}
            key={Widgets.RecentSwipeStats}
            editing={editing}
          />
        );
      case Widgets.LongTermSwipeStats:
        return (
          <LongTermSwipeStats
            index={index}
            moveWidget={moveWidget}
            id={Widgets.LongTermSwipeStats}
            key={Widgets.LongTermSwipeStats}
            editing={editing}
          />
        );
      case Widgets.TestWidget:
        return (
          <TestWidget
            index={index}
            moveWidget={moveWidget}
            id={Widgets.TestWidget}
            key={Widgets.TestWidget}
            editing={editing}
          />
        );
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Paper
        style={{
          width: "calc(100vw - 110px)",
          marginLeft: 90,
          display: "flex",
          flexDirection: "row",
          marginBottom: 20,
        }}
      >
        <h3 style={{ marginLeft: 20, marginRight: "auto" }}>
          Welcome to the track and taste Dashboard
        </h3>
        {!editing && (
          <Button
            style={{ marginRight: 20 }}
            onClick={() => {
              props.observer.updateBackup();
              setEditing(true);
            }}
          >
            <Edit />
            Edit Dashboard
          </Button>
        )}
        {editing && (
          <>
            <Button
              style={{ marginRight: 20 }}
              onClick={() => {
                props.observer.revertToBackup();
                setEditing(false);
              }}
            >
              <UndoRounded />
              Revert Changes
            </Button>
            <Button
              color="secondary"
              style={{ marginRight: 20 }}
              onClick={() => {
                props.observer.save();
                setEditing(false);
              }}
            >
              <Save />
              Save Changes
            </Button>
          </>
        )}
      </Paper>
      <div className="grid">
        {editing && <AddWidget observer={props.observer} />}
        {editing && <RemoveWidget observer={props.observer} />}
        {editing && <div className="c2 r1" />}
        {widgets.map((widget, index) => renderWidget(widget, index))}
      </div>
      <div className={`side-container ${editing ? "editing" : ""}`}>
        {allWidgets.map((widget, index) => renderWidget(widget, index))}
      </div>
    </DndProvider>
  );
};

export default Home;
