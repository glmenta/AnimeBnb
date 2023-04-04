import React, { useState } from 'react';
import { NavLink, useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import * as sessionActions from '../../store/session';
import whiteLogo from '../../images/logo.png';
import blackLogo from '../../images/black-logo.png';
import LoginModal from '../LoginModal';
import LoginFormPage from '../LoginFormPage';
import SignupModal from '../SignupModal';
import SignupFormPage from '../SignupFormPage';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();

  const history = useHistory()

  const [islogInOpen, setIsLogInOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
  };

  const openLogInModal = () => {
    setIsLogInOpen(true);
    history.push('/');
  };

  const openSignupModal = () => {
    setIsSignupOpen(true);
    history.push('/');
  };

  const handleLoginSuccess = () => {
    setIsLogInOpen(false);
  };

  const handleSignupSuccess = () => {
    setIsSignupOpen(false);
  };

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li className='logged_in_icon'>
        <button className='create-spot-button'><NavLink to="/create-spot" className="create_spot_link">Create a New Spot</NavLink></button>
         <button onClick={logout}>Log Out</button>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <li className='not_logged_in'>
        <button onClick={openLogInModal}><NavLink to="/login" className="sign-log-in-link">Log In</NavLink></button>
        <button onClick={openSignupModal}><NavLink to="/signup" className="sign-log-in-link">Sign Up</NavLink></button>
      </li>
    );
  }

  return (
   <div className='nav-container'>
    <ul>
    <div className='home-button'>
    <li className='nav-li'>
      <NavLink exact to="/">
        <img src={whiteLogo} alt="logo" className='logo' />
      </NavLink>
    </li>
    </div>
    {isLoaded && (
    <div className='profile-button'>
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    </div>
    )}
    </ul>
  <LoginModal open={islogInOpen} onClose={() => setIsLogInOpen(false)}><LoginFormPage onSuccess={handleLoginSuccess} /></LoginModal>
  <SignupModal open={isSignupOpen} onClose={() => setIsSignupOpen(false)}><SignupFormPage onSuccess={handleSignupSuccess} /></SignupModal>
</div>
  );
}

export default Navigation;
