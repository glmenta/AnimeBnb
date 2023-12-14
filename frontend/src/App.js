import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LoginModal from "./components/Session/LoginModal";
import SignupModal from "./components/Session/SignupModal";
import SpotList from "./components/Spots/SpotList";
import SpotDetailPage from "./components/Spots/SpotDetailsPage";
import CreateNewSpot from "./components/Spots/CreateSpotPage";
import UpdateSpotPage from "./components/Spots/UpdateSpotsPage";
import OwnedSpotsPage from "./components/Spots/OwnedSpotsPage";
import ReviewModal from "./components/Reviews/ReviewModal";
import Footer from "./components/footer";

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
          <Route path ='/spots/new'>
            <CreateNewSpot/>
          </Route>
          <Route path='/spots/:spotId/edit'>
            <UpdateSpotPage spotId={spotId} setSpotId={setSpotId}/>
          </Route>
          <Route path='/spots/:spotId'>
            <SpotDetailPage spotId={spotId} setSpotId={setSpotId}/>
          </Route>
          <Route path='/spots/:spotId/reviews'>
            <ReviewModal spotId={spotId} setSpotId={setSpotId}/>
          </Route>
        </Switch>
      )}
      <Footer/>
    </div>
  );
}

export default App;
