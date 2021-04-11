import React from "react";
import CSS from 'csstype';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';


import { Name } from './steps/Name';
import { Desc } from './steps/Desc';

const mainStyle: CSS.Properties = {
  textAlign: 'center'
};


const buttonStyleNext: CSS.Properties = {
  top: '60px',
  width: '10vmax'
};



interface Props {

  current: number

};


// function displayStep(): React.CElement {
//   return <Name />
// } 


const RestaurantBuilder: React.FC<Props> = ({current}) => {
  return (
    <div className="content" style={mainStyle}>

      <LinearProgress variant="determinate" value={75} />

      {current == 0 ? <Name /> : <Desc />}

      <Button style={buttonStyleNext} variant="contained" color="primary">
        <ArrowForwardIosIcon />
      </Button>
      

    </div>
  );
};

export default RestaurantBuilder;
