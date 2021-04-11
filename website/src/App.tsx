import React, { useMemo } from "react";
import Nav from "./nav/Nav";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./styles/index.scss";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Home from "./Home";
import LogIn from "./onboarding/LogIn";
import DragNDrop from "./file-upload/DragNDrop";
import { Observer } from "./dashboard/WidgetObserver";
import RestaurantBuilder from "./restaurant-builder/RestaurantBuilder";
import MenuBuilder from "./menu-builder/MenuBilder";
import ItemBuilder from "./item-builder/ItemBuilder";

const dummyData = [
  { id: 1, name: "The Bruty's Arms" },
  { id: 2, name: "The Royal Davies" },
  { id: 3, name: "The Lakin's Head" },
  { id: 4, name: "Denman's Diner" },
];

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
          secondary: {
            main: "#4caf50",
          },
          type: prefersDarkMode ? "dark" : "light",
        },
      }),
    [prefersDarkMode]
  );

  // Just here to cause the nav to re-render after log-in
  const [updateState, setUpdateState] = React.useState(false);

  const refresh = () => setUpdateState(!updateState);

  const widgetObserver = useMemo(() => new Observer(), []);

  const [selectedRestaurant, setSelectedRestaurant] = React.useState<{
    id: number;
    name: string;
  }>(dummyData[0]);

  return (
    <ThemeProvider theme={theme}>
      <div
        className="app"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <BrowserRouter>
          <Nav
            colour={prefersDarkMode ? "#333333" : theme.palette.primary.light}
            selectedRestaurant={selectedRestaurant}
            setSelectedRestaurant={setSelectedRestaurant}
            restaurants={dummyData}
          />
          <main>
            <Switch>
              <Route
                exact
                path="/"
                render={() => <Home observer={widgetObserver} />}
              />
              <Route
                exact
                path="/log-in"
                render={() => <LogIn refresh={refresh} />}
              />
              <Route
                exact
                path="/upload"
                render={() => <DragNDrop foodID={1} />}
              />
              <Route
                exact
                path="/restaurant-builder"
                render={() => <RestaurantBuilder current={1} />}
              />
              <Route
                exact
                path="/menu-builder"
                render={() => <MenuBuilder />}
              />
              <Route
                exact
                path="/item-builder"
                render={() => <ItemBuilder />}
              />
            </Switch>
          </main>
        </BrowserRouter>
      </div>
    </ThemeProvider>
  );
}

export default App;
