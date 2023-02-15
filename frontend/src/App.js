import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPageAllSpots from "./components/LandingPageAllSpots";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/CreateSpot";
import ManageSpots from "./components/ManageSpots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/" component={LandingPageAllSpots} />
          <Route path="/spots/new" component={CreateSpotForm} />
          <Route path="/spots/current" component={ManageSpots} />
          <Route path="/spots/:spotId" component={SpotDetails} />
          <Route>
            <p>Page Not Found</p>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
