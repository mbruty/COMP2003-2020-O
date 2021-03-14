
import React from "react";
import clsx from "clsx";
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import { red } from "@material-ui/core/colors";
import CheckIcon from "@material-ui/icons/Check";
import { Fab } from "@material-ui/core";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
      alignItems: "center",
    },
    wrapper: {
      margin: theme.spacing(1),
      position: "relative",
    },
    buttonSuccess: {
      backgroundColor: red[500],
      "&:hover": {
        backgroundColor: red[700],
      },
    },
    fabProgress: {
      color: red[500],
      position: "absolute",
      top: -14,
      left: -6,
      zIndex: 1,
    },
    buttonProgress: {
      color: red[500],
      position: "absolute",
      top: "50%",
      left: "50%",
      marginTop: -12,
      marginLeft: -12,
    },
  })
);

interface Props {
  loading: boolean;
  success: boolean;
}

export default function LoadingBtn(props: Props) {
  const classes = useStyles();

  const buttonClassname = clsx({
    [classes.buttonSuccess]: props.success,
  });

  return (
    <div className={classes.wrapper}>
      <Fab
        aria-label="save"
        color="primary"
        className={buttonClassname}
        style={{ height: 56, top: -8 }}
      >
        {props.success ? <CheckIcon /> : <FontAwesomeIcon icon={faUpload} />}
      </Fab>
      {props.loading && (
        <CircularProgress size={68} className={classes.fabProgress} />
      )}
    </div>
  );
}