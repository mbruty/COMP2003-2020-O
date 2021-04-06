import React from "react";
import CSS from 'csstype';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';

const contentBoxStyle: CSS.Properties = {
  width: '60%',
  textAlign: 'center',
  marginLeft: 'auto',
  marginRight: 'auto'
};

interface Props {}


const RestaurantBuilder: React.FC<Props> = () => {
  return (
    <div className="content" style={contentBoxStyle}>

      <LinearProgress variant="determinate" value={75} /><p>50%</p>

      <h1>Restaurant Builder</h1>
      <p>
        Welcome to the Track and Taste Restaurant Builder.<br></br><br></br>
        When prompted, please enter your Restaurant information on screen. After creation, you will be able to change your information.
        Please input this information with care; it will be important for when the Track and Taste team look to verify your business.
      </p>

    </div>
  );
};

export default RestaurantBuilder;
