import React from "react";
import CSS from 'csstype';
import LinearProgress from '@material-ui/core/LinearProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import TextField from '@material-ui/core/TextField';


// import { Name } from './steps/Name';
// import { Desc } from './steps/Desc';

const mainStyle: CSS.Properties = {
  textAlign: 'center'
};


const buttonStyleNext: CSS.Properties = {
  top: '60px',
  width: '10vmax'
};


const formStyling: CSS.Properties = {
width: '50vmax'
};

const headingStyle: CSS.Properties = {
  textAlign: 'left',
  paddingLeft: '4%'
};



interface Props {

  // current: number

};



const RestaurantBuilder: React.FC<Props> = () => {
  return (
    <div className="content" style={mainStyle}>

      {/* <LinearProgress variant="determinate" value={75} /> */}

      <h1>Restaurant Builder</h1>

      <div>
        <h2 style={headingStyle}>Name</h2>
        <TextField style={formStyling} required id="form-name" label="Required" variant="outlined" helperText="Give your restaurant a name. Maximum 60 characters." />
      </div>

      <div>
        <h2 style={headingStyle}>Description</h2>
        <TextField style={formStyling} required id="form-name" label="Required" variant="outlined" helperText="Give your restaurant a neat description. Maximum 120 characters." />
      </div>

      <div>
        <h2 style={headingStyle}>Telephone</h2>
        <TextField style={formStyling} id="form-name" label="Optional" variant="outlined" helperText="Make it easier for customers to reach you. Offer your phone number, without spaces." />
      </div>

      <div>
        <h2 style={headingStyle}>Email</h2>
        <TextField style={formStyling} id="form-name" label="Optional" variant="outlined" helperText="Does your business have an email address? Enter it here." />
      </div>

      <div>
        <h2 style={headingStyle}>Website</h2>
        <TextField style={formStyling} id="form-name" label="Optional" variant="outlined" helperText="Enter your restaurant's web page here." />
      </div>

      <Button style={buttonStyleNext} variant="contained" color="primary">
        <ArrowForwardIosIcon />
      </Button>

      <br></br>
      

    </div>
  );
};

export default RestaurantBuilder;
