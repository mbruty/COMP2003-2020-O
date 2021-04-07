import React from "react";
import CSS from 'csstype';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


import { Name } from './steps/Name';

const mainStyle: CSS.Properties = {
  textAlign: 'center'
};


const buttonStyleNext: CSS.Properties = {
  top: '60px',
  width: '10vmax'
};



interface Props {}


const RestaurantBuilder: React.FC<Props> = () => {
  return (
    <div className="content" style={mainStyle}>

      <LinearProgress variant="determinate" value={75} />

      <Name />

      <Button style={buttonStyleNext} variant="contained" color="primary">
        <ArrowForwardIosIcon />
      </Button>
      

    </div>
  );
};

export default RestaurantBuilder;
