import React from "react";
import Widget from "./Widget";
import IWidgetProps from "./IWidgetProps";

const ExampleWidget: React.FC<IWidgetProps> = (props) => {
  return (
    <Widget {...props} rows={1} columns={1}>
      {
        // Write the component code here!
      }
    </Widget>
  );
};

export default ExampleWidget;
