import { CircularProgress, Paper } from "@material-ui/core";
import React from "react";
import Scanner from "react-webcam-qr-scanner";

const QrReader = () => {
  const [loading, setLoading] = React.useState(true);
  const [foundCode, setFoundCode] = React.useState(false);
  const handleDecode = ({data}) => {
    setFoundCode(true);
    console.log(data.split('?code=')[1]);
  };
  const handleScannerLoad = async() => {
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
        {foundCode && <p>Code successfully scanned, verifying restaurant...</p>}
      </Paper>
    </div>
  );
};

export default QrReader;
