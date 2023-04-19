import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPageAllSpots from "./components/LandingPageAllSpots";
import LandingPageFooter from "./components/LandingPageFooter";
import SpotDetails from "./components/SpotDetails";
import CreateSpotForm from "./components/CreateSpot";
import ManageSpots from "./components/ManageSpots";
import GetEditSpot from "./components/EditSpot/GetEditSpot";

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
          <Route exact path="/">
            <LandingPageAllSpots />
            <LandingPageFooter />
          </Route>
          <Route path="/spots/new">
            <CreateSpotForm />
          </Route>
          <Route path="/spots/current">
            <ManageSpots />
          </Route>
          <Route path="/spots/:spotId/edit">
            <GetEditSpot />
          </Route>
          <Route path="/spots/:spotId">
            <SpotDetails />
          </Route>
          <Route>
            <p>Page Not Found</p>
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
