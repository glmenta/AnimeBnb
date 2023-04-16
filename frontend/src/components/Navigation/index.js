import React, { useState } from 'react';
import { NavLink, useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';
import * as sessionActions from '../../store/session';
import whiteLogo from '../../images/logo.png';
//import blackLogo from '../../images/black-logo.png';
import LoginModal from '../Session/LoginModal';
import LoginFormPage from '../Session/LoginFormPage';
import SignupModal from '../Session/SignupModal';
import SignupFormPage from '../Session/SignupFormPage';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);
  const dispatch = useDispatch();
  const history = useHistory()

  const [islogInOpen, setIsLogInOpen] = useState(false)
  const [isSignupOpen, setIsSignupOpen] = useState(false)
  const [createButton, setCreateButton] = useState(false);

  const toggleCreateButton = () => {
    setCreateButton(true)
  }

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

  console.log('this is logged in user', sessionUser)
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
         {sessionUser && (
            <div className='create-spot-button' style={{backgroundColor: 'red'}}>
              <NavLink to={`/spots/new`} className="create_spot_link">Create a New Spot</NavLink>
            </div>
          )}
    </ul>
  <LoginModal open={islogInOpen} onClose={() => setIsLogInOpen(false)}><LoginFormPage onSuccess={handleLoginSuccess} /></LoginModal>
  <SignupModal open={isSignupOpen} onClose={() => setIsSignupOpen(false)}><SignupFormPage onSuccess={handleSignupSuccess} /></SignupModal>
</div>
  );
}

export default Navigation;

 // const logout = (e) => {
  //   e.preventDefault();
  //   dispatch(sessionActions.logout());
  // };

// let sessionLinks;
  // if (sessionUser) {
  //   console.log('this is sesh user', sessionUser)
  //   sessionLinks = (
  //     <li className='logged_in_icon'>
  //       <button className='create-spot-button' style={{
  //         backgroundColor: 'transparent',
  //         border: 'none',
  //         outline: 'none',
  //         }}>
  //           <NavLink to={`/spots/new`} className="create_spot_link"
  //           style={{ backgroundColor: 'transparent', textDecoration: 'none', color: 'inherit' }}
  //           >Create a New Spot</NavLink>
  //           </button>
  //       <ProfileButton user={sessionUser} />
  //     </li>
  //   );
  // } else {
  //   sessionLinks = (
  //     <li className='not_logged_in'>
  //       <button onClick={openLogInModal}><NavLink to="/login" className="sign-log-in-link">Log In</NavLink></button>
  //       <button onClick={openSignupModal}><NavLink to="/signup" className="sign-log-in-link">Sign Up</NavLink></button>
  //     </li>
  //   );
  // }
