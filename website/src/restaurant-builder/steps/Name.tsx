import React from "react";
import CSS from 'csstype';

const contentBoxStyle: CSS.Properties = {
    // width: '60%',
    // textAlign: 'center',
    // marginLeft: 'auto',
    // marginRight: 'auto'
  };

interface Props {}

export const Name: React.FC<Props> = () => {
  return (
    <div style={contentBoxStyle}>
      <h1>Name Your Restaurant</h1>
      <p>
        Time to give your restaurant a sick name.
      </p>
    </div>
  );
};
