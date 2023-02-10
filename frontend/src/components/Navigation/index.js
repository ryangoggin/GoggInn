// Phase 3: Frontend Authme
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <li>
        <ProfileButton user={sessionUser} />
      </li>
    );
  } else {
    sessionLinks = (
      <>
        <li>
            <NavLink to="/login" className={"nav-text"}>Log In</NavLink>
        </li>
        <li>
            <NavLink to="/signup" className={"nav-text"}>Sign Up</NavLink>
        </li>
      </>
    );
  }

  return (
    <ul>
      <li>
        <NavLink exact to="/" className={"nav-text"}>Home</NavLink>
      </li>
      {isLoaded && sessionLinks}
    </ul>
  );
}

export default Navigation;
