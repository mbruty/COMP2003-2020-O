import React, { useMemo } from "react";
import Nav from "./Nav";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./App.css";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  console.log(prefersDarkMode);

  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          background: {
            paper: prefersDarkMode ? "#424242" : "#FFF",
            default: prefersDarkMode ? "#303030" : "#FFF",
          },
          primary: {
            light: "#7986cb",
            main: "#3f51b5",
            dark: "#303f9f",
          },
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );
  return (
    <ThemeProvider theme={theme}>
      <div
        className="App"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <Nav />
        <p>{prefersDarkMode.toString()}</p>
        <h1>hello</h1>
      </div>
    </ThemeProvider>
  );
}

export default App;
