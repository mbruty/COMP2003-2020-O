import React, { useMemo } from "react";
import Nav from "./Nav";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./styles/index.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import LogIn from "./onboarding/LogIn";
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
            light: "#7986cb",
            main: "#55b0ed",
            dark: "#5564ed",
          },
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  const authToken = useMemo(
    () => window.localStorage.getItem("auth-token"),
    []
  );
  return (
    <ThemeProvider theme={theme}>
      <div
        className="app"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <Nav
          colour={prefersDarkMode ? "#333333" : theme.palette.primary.main}
        />
        <main>
          <BrowserRouter>
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Home user={{ authToken: authToken }} />}
              />
              <Route exact path="/log-in" render={() => <LogIn />} />
            </Switch>
          </BrowserRouter>
        </main>
      </div>
    </ThemeProvider>
  );
}

export default App;
