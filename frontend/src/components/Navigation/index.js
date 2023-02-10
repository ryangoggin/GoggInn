// Phase 3: Frontend Authme --> Phase 4 Modal --> Bonus Phase Modals from Dropdown
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ProfileButton from './ProfileButton';
import './Navigation.css';

function Navigation({ isLoaded }){
  const sessionUser = useSelector(state => state.session.user);

  return (
    <div className='nav-container'>
        <ul>
        <li>
            <NavLink exact to="/" className="nav-text">Home</NavLink>
        </li>
        {isLoaded && (
            <li>
            <ProfileButton user={sessionUser} />
            </li>
        )}
        </ul>
    </div>
  );
}

export default Navigation;
