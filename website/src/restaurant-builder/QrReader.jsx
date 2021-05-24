import { CircularProgress, Paper } from "@material-ui/core";
import React from "react";
import Scanner from "react-webcam-qr-scanner";

const QrReader = () => {
  const [loading, setLoading] = React.useState(true);
  const [foundCode, setFoundCode] = React.useState(false);
  const [verificationState, setVerificationState] = React.useState();
  const handleDecode = ({ data }) => {
    setFoundCode(true);
    if (data.split("?code=")[1] !== "2$RtwH3jR5MQi&LOEmY") {
      setTimeout(() => setVerificationState(1), 2000);
      setTimeout(() => {
        setFoundCode(false);
        setVerificationState(undefined);
      }, 6000);
    } else {
      setTimeout(() => setVerificationState(2), 2000);
    }
  };
  const handleScannerLoad = async () => {
    setLoading(false);
  };
  return (
    <div className="content">
      <Paper
        style={{
          padding: "2em",
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        {loading && (
          <div style={{ margin: "auto" }}>
            <CircularProgress />
            <p>Please enable your camera</p>
          </div>
        )}
        <Scanner
          className="some-classname"
          onDecode={handleDecode}
          onScannerLoad={handleScannerLoad}
          constraints={{
            audio: false,
            video: {
              facingMode: "environment",
            },
          }}
          captureSize={{ width: 1280, height: 720 }}
        />
        {!foundCode && <p>Looking for code...</p>}
        {foundCode && !verificationState && (
          <div
            style={{
              display: "grid",
              placeItems: "center",
              marginTop: 50,
            }}
          >
            <CircularProgress />
            <p>Code successfully scanned, verifying restaurant...</p>
          </div>
        )}
        {verificationState === 1 && <p>Incorrect code provided, try again</p>}
        {verificationState === 2 && (
          <p>
            Your restaurant has been verified, and is able to be swiped on now!
          </p>
        )}
      </Paper>
    </div>
  );
};

export default QrReader;
