import React, { useMemo } from "react";
import Nav from "./nav/Nav";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./styles/index.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import LogIn from "./onboarding/LogIn";
import DragNDrop from "./file-upload/DragNDrop";

function App() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const theme = useMemo(
    () =>
      createMuiTheme({
        palette: {
          background: {
            paper: prefersDarkMode ? "#303030" : "#FFF",
            default: prefersDarkMode ? "#212121" : "#FFF",
          },
          primary: {
            light: "#ff776c",
            main: prefersDarkMode ? "#FD4040" : "#ff776c",
            dark: prefersDarkMode ? "#c20018" : "#FD4040",
          },
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );


  return (
    <ThemeProvider theme={theme}>
      <div
        className="app"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <Nav
          colour={prefersDarkMode ? "#333333" : theme.palette.primary.light}
        />
        <main>
          <BrowserRouter>
            <Switch>
              <Route exact path="/" render={() => <Home />} />
              <Route exact path="/log-in" render={() => <LogIn />} />
              <Route exact path="/upload" render={() => <DragNDrop />} />
            </Switch>
          </BrowserRouter>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
