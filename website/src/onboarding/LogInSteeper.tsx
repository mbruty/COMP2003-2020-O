import {
  Button,
  createStyles,
  makeStyles,
  Step,
  StepLabel,
  Stepper,
  Theme,
  Typography,
} from "@material-ui/core";
import React from "react";

interface Props {
  show: boolean;
  activeStep: number;
  setActiveStep: React.Dispatch<React.SetStateAction<number>>;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backButton: {
      marginRight: theme.spacing(1),
    },
    instructions: {
      marginTop: theme.spacing(1),
      marginBottom: theme.spacing(1),
    },
  })
);

function getSteps() {
  return ["Sign in", "Create your restaurant", "Add your menu "];
}

function getStepContent(stepIndex: number) {
  switch (stepIndex) {
    case 0:
      return "Sign in, or create an account!";
    case 1:
      return "Tell us about your restaurant";
    case 2:
      return "Yum Yum Nom Noms";
    default:
      return "Unknown stepIndex";
  }
}

const LogInStepper: React.FC<Props> = ({ show, activeStep, setActiveStep }) => {
  const classes = useStyles();
  const steps = getSteps();
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  if (!show) return null;
  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        {activeStep === steps.length ? (
          <div className="stepper-btn-container">
            <Typography className={classes.instructions}>
              All steps completed
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div className="stepper-btn-container">
            <Typography className={classes.instructions}>
              {getStepContent(activeStep)}
            </Typography>
            <div>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                className={classes.backButton}
              >
                Back
              </Button>
              <Button variant="contained" color="primary" onClick={handleNext}>
                {activeStep === steps.length - 1 ? "Finish" : "Next"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default LogInStepper;
