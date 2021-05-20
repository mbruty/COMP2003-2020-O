import React, { useMemo } from "react";
import Nav from "./nav/Nav";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import "./styles/index.scss";
import {
  Redirect,
  Route,
  Switch,
  useHistory,
  withRouter,
} from "react-router-dom";
import Home from "./Home";
import LogIn from "./onboarding/LogIn";
import DragNDrop from "./file-upload/DragNDrop";
import { Observer } from "./dashboard/WidgetObserver";
import RestaurantBuilder from "./restaurant-builder/RestaurantBuilder";
import MenuBuilder from "./menu-builder/MenuBilder";
import ItemBuilder from "./item-builder/ItemBuilder";
import { API_URL } from "./constants";
import SelectItem from "./item-builder/SelectItem";
import QrReader from "./restaurant-builder/QrReader";
import VerifyRestaurant from "./restaurant-builder/VerifyRestaurant";
import TagBuilder from "./Community-food-tags/CommunityFoodTags";
import { RestaurantContext } from "./RestaurantContext";

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
          secondary: {
            light: "#ff776c",
            main: prefersDarkMode ? "#FD4040" : "#ff776c",
            dark: prefersDarkMode ? "#c20018" : "#FD4040",
          },
          primary: {
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
  }>({
    id: 0,
    name: "Loading...",
  });

  const [restaurants, setRestaurants] = React.useState<
    {
      id: number;
      name: string;
    }[]
  >([
    {
      id: 0,
      name: "Loading...",
    },
  ]);

  const history = useHistory();

  React.useEffect(() => {
    // Check that the cookie we have stored is valid
    fetch(API_URL + "/admin/authcheck", {
      method: "POST",
      mode: "cors",
      credentials: "include",
    }).then((response) => {
      console.log(history.location.pathname);

      if (response.status === 401) {
        history.push("/log-in");
      } else if (history.location.pathname === "/log-in") {
        // Send them to the dash screen if they are already logged in and are trying to view /log-in
        history.push("/");
      }
    });
  }, [history]);

  React.useEffect(() => {
    (async () => {
      const res = await fetch(API_URL + "/restaurant/me", {
        mode: "cors",
        method: "GET",
        credentials: "include",
      });

      if (res.status === 200) {
        const data = await res.json();
        console.log(
          data.restaurants.map((restaurant: any) => {
            return {
              id: restaurant.RestaurantID,
              name: restaurant.Name,
            };
          })
        );

        setRestaurants(
          data.restaurants.map((restaurant: any) => {
            return {
              id: restaurant.RestaurantID,
              name: restaurant.RestaurantName,
            };
          })
        );
        const previouslySelected = window.localStorage.getItem(
          "selectedRestaurant"
        );
        if (previouslySelected) {
          const previouslySelectedRestaurantIdx = data.restaurants.findIndex(
            (element: any) => element.RestaurantID === previouslySelected
          );

          if (previouslySelectedRestaurantIdx !== -1) {
            setSelectedRestaurant(
              data.restaurants[previouslySelectedRestaurantIdx]
            );
            return;
          }
        }
        console.log(data.restaurants[0]);

        setSelectedRestaurant({
          id: data.restaurants[0].RestaurantID,
          name: data.restaurants[0].RestaurantName,
        });
      }
      else if(res.status === 404) {
        setRestaurants([{id: 0, name: "Create a restaurant"}]);
        setSelectedRestaurant({id: 0, name: "You don't own any restaurants"})
      }
      else {
        history.push("/log-in");
      }
    })();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div
        className="app"
        style={{ backgroundColor: theme.palette.background.default }}
      >
        <Nav
          colour={prefersDarkMode ? "#333333" : theme.palette.primary.light}
          selectedRestaurant={selectedRestaurant}
          setSelectedRestaurant={setSelectedRestaurant}
          restaurants={restaurants}
        />
        <main>
          <RestaurantContext.Provider value={selectedRestaurant}>
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
                path="/restaurant-builder"
                render={() => <RestaurantBuilder />}
              />
              <Route
                exact
                path="/menu-builder"
                render={() => <MenuBuilder />}
              />
              <Route exact path="/item-builder/:id" component={ItemBuilder} />
              <Route exact path="/item-builder" component={SelectItem} />
              <Route exact path="/verify" component={QrReader} />
              <Route exact path="/verify/:code" component={VerifyRestaurant} />
              <Route exact path="/tags" component={TagBuilder} />
              <Redirect to="/" />
            </Switch>
          </RestaurantContext.Provider>
        </main>
      </div>
    </ThemeProvider>
  );
}

// WithRouter causes the auth check to happen every page change
export default withRouter(App);
