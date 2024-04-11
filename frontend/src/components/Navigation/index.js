import React, { useState } from 'react';
import { NavLink, useHistory, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ProfileButton from './ProfileButton';
import './updateNav.css';
import * as sessionActions from '../../store/session';
import whiteLogo from '../../images/logo.png';
import animeLogo from '../../images/animebnblogo.png';
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

  return (
   <div className='nav-container'>
    <ul className='nav-ul'>
      <div className='home-button'>
      <li className='nav-li'>
        <NavLink exact to="/">
          <img src={animeLogo} alt="logo" className='logo' />
        </NavLink>
      </li>
      </div>

          <div className='create-spot-div'>
          {sessionUser && (
              <div>
                <div className='create-spot-button'>
                  <NavLink to={`/spots/new`} className="create-spot-link">Create a New Spot</NavLink>
                </div>
              </div>
            )}
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
