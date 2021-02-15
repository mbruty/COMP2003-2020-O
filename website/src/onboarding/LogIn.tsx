import { Button, Paper } from "@material-ui/core";
import React, { useState } from "react";
import LogInStepper from "./LogInSteeper";
import SignInForm from "./SignInOrUpForm";

interface Props {}

const LogIn: React.FC<Props> = (props) => {
  const [activeStep, setActiveStep] = React.useState<number>(0);
  const [tabIdx, setTabIdx] = React.useState<number>(0);

  const renderPage = () => {
    switch (activeStep) {
      case 0:
        return <SignInForm tabIdx={tabIdx} setTabIdx={setTabIdx} />;
      default:
        return null;
    }
  };

  // If both active step and tabidx are 0, then we're loggin in and don't need to show the stepper
  const showStepper = !(tabIdx === 0 && activeStep === 0);

  return (
    <Paper style={{ padding: 25 }}>
      <div>
        <h1>Welcome to the Track and Taste Dashboard</h1>
      </div>
      {renderPage()}
      <LogInStepper
        show={showStepper}
        activeStep={activeStep}
        setActiveStep={setActiveStep}
      />
    </Paper>
  );
};

export default LogIn;
