import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LoginFormPage from "./components/LoginFormPage";
import SignupFormPage from "./components/SignupFormPage";
import LoginModal from "./components/LoginModal";
import SignupModal from "./components/SignupModal";
import Spots from "./components/Spots";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);

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
            <Spots />
          </Route>
          <Route path="/login">
            <LoginModal />
          </Route>
          <Route path="/signup">
            <SignupModal />
          </Route>
        </Switch>
      )}
    </div>
  );
}

export default App;
