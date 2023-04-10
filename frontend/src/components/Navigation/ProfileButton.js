import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { NavLink, useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import OpenModalMenuItem from './OpenModalMenuItem';
import LoginFormModal from '../Session/LoginFormPage';
import SignupFormModal from '../Session/SignupFormPage';
import './ProfileButton.css';

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const [showMenu, setShowMenu] = useState(false);
  const [profileClicked, setProfileClicked] = useState(false);

  const ulRef = useRef();
  const history = useHistory();

  const openMenu = () => {
    // if (showMenu) return;
    setShowMenu(true);
    setProfileClicked(true);
    document.getElementById('profile-dropdown').style.display = 'block';
  };


  useEffect(() => {
    console.log('useEff called')
    if (!showMenu) return;

    const closeMenu = (e) => {
      console.log('click event', e.target);
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
        setProfileClicked(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  // const closeMenu = () => {
  //   if (!ulRef.current) {
  //     setShowMenu(false);
  //     setProfileClicked(false);
  //   }

  // }

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push('/')
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <div id="profile-container">
      <button onClick={openMenu} id='profile-button' style={{ backgroundColor: 'transparent' }}>
        <i className="fas fa-bars" style={{
          fontSize: '14px',
          paddingRight: '12px',
          paddingLeft: '5px',
        }} />
        <i className="fas fa-user-circle" style={{
          fontSize: '30px',
        }} />
      </button>
      <div className='profile-dropdown-contents'>
      <ul className={ulClassName} ref={ulRef} id='profile-dropdown'>
        {user && profileClicked ? (
          <div id='user-dropdown' >
            <li id="firstname">Hello, {user.firstName} {user.lastName}</li>
            <li id="email">{user.email}</li>
            <li id="manage-spots">
              <NavLink to={`/users/${user.id}/spots`}>
                Manage Spots
              </NavLink>
              </li>
            <li id="li-logout">
              <button onClick={logout} id="logout-button">Log Out</button>
            </li>
          </div>
        ) : (
        <div className='dropdown-menu'>
          <div className='dropdown-contents'>
            {profileClicked && (
              <>
                <div className="login-button">
                  <OpenModalMenuItem
                    itemText="Log In"
                    //onItemClick={closeMenu}
                    modalComponent={<LoginFormModal />}
                  />
                </div>
                <div className="signup-button">
                  <OpenModalMenuItem
                    itemText="Sign Up"
                    //onItemClick={closeMenu}
                    modalComponent={<SignupFormModal />}
                  />
                </div>
              </>
            )}
          </div>
          </div>
        )}
      </ul>
      </div>
    </div>
  );
}

export default ProfileButton;
