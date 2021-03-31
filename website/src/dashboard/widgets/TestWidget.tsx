import React from "react";
import DraggableWidget from "../DraggableWidget";
import IWidgetProps from "../IWidgetProps";
import Widget from "../Widget";

const TestWidget: React.FC<IWidgetProps> = (props) => {
  if (props.editing) {
    return (
      <DraggableWidget {...props} rows={1} columns={1}>
        <div
          style={{
            display: "flex",
            flexFlow: "row nowrap",
            justifyContent: "space-evenly",
          }}
        >
          <img
            src="https://media0.giphy.com/media/Nx0rz3jtxtEre/200w.gif?cid=ecf05e47norc30qa3znd739fiqoxu8sofvm2atmobd1b3xva&amp;rid=200w.gif"
            alt="revenge of the sith prequel GIF"
            width="248"
            height="124"
          ></img>
          <img
            src="https://media0.giphy.com/media/8JTFsZmnTR1Rs1JFVP/200w.gif?cid=ecf05e47900986zfz52cghzym6c1lx143dqeebmfr60ud12w&amp;rid=200w.gif"
            alt="kenobi GIF"
            width="248"
            height="124"
          ></img>
        </div>
      </DraggableWidget>
    );
  }
  return (
    <Widget {...props} rows={1} columns={1}>
      <div
        style={{
          display: "flex",
          flexFlow: "row nowrap",
          justifyContent: "space-evenly",
        }}
      >
        <img
          src="https://media0.giphy.com/media/Nx0rz3jtxtEre/200w.gif?cid=ecf05e47norc30qa3znd739fiqoxu8sofvm2atmobd1b3xva&amp;rid=200w.gif"
          alt="revenge of the sith prequel GIF"
          width="248"
          height="124"
        ></img>
        <img
          src="https://media0.giphy.com/media/8JTFsZmnTR1Rs1JFVP/200w.gif?cid=ecf05e47900986zfz52cghzym6c1lx143dqeebmfr60ud12w&amp;rid=200w.gif"
          alt="kenobi GIF"
          width="248"
          height="124"
        ></img>
      </div>
    </Widget>
  );
};

export default TestWidget;
