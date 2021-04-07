import React from "react";
import CSS from 'csstype';
import TextField from '@material-ui/core/TextField';

import {InfoBox} from './stepFeatures/InfoBox'

const contentBoxStyle: CSS.Properties = {
    textAlign: 'center'
};

const formStyling: CSS.Properties = {
  width: '50vmax'
};

interface Props {}

export const Name: React.FC<Props> = () => {
  return (
    <div style={contentBoxStyle}>
      <h1>Name Your Restaurant</h1>
      <br></br>
      <TextField style={formStyling} required id="form-name" label="Restaurant Name" variant="filled" />
    </div>
  );
};
