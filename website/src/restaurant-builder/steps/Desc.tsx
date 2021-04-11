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

export const Desc: React.FC<Props> = () => {
  return (
    <div style={contentBoxStyle}>
      <h1>Add a Description</h1>
      <br></br>
      <TextField style={formStyling} required id="form-name" label="Restaurant Description" variant="filled" />
    </div>
  );
};
