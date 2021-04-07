import React from "react";
import CSS from 'csstype';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

import { Name } from './steps/Name';

const mainStyle: CSS.Properties = {
  textAlign: 'center'
};



interface Props {}


const RestaurantBuilder: React.FC<Props> = () => {
  return (
    <div className="content" style={mainStyle}>

      <LinearProgress variant="determinate" value={75} />

      <Name />

      

    </div>
  );
};

export default RestaurantBuilder;
