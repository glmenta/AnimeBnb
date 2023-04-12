import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LoginFormPage from "./components/Session/LoginFormPage";
import SignupFormPage from "./components/Session/SignupFormPage";
import LoginModal from "./components/Session/LoginModal";
import SignupModal from "./components/Session/SignupModal";
import SpotList from "./components/Spots/SpotList";
import SpotDetailPage from "./components/Spots/SpotDetailsPage";
import CreateNewSpot from "./components/Spots/CreateSpotPage";
import ManageSpotPage from "./components/Spots/ManageSpotsPage";
import OwnedSpotsPage from "./components/Spots/OwnedSpotsPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  const [spotId, setSpotId] = useState(null)

  useEffect(() => {
    dispatch(sessionActions.restoreUser());
    setIsLoaded(true)
  }, [dispatch]);

  return (
    <div className='App'>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/">
            <SpotList />
          </Route>
          <Route path="/login">
            <LoginModal />
          </Route>
          <Route path="/signup">
            <SignupModal />
          </Route>
          <Route path='/spots/current'>
            <OwnedSpotsPage/>
          </Route>
          <Route path='/spots/:spotId'>
            <SpotDetailPage spotId={spotId} setSpotId={setSpotId}/>
          </Route>
          <Route path = '/create-spot'>
            <CreateNewSpot/>
          </Route>
          <Route path='/spots/:spotId/edit'>
            <ManageSpotPage spotId={spotId} setSpotId={setSpotId}/>
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
