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
            <i className="fa-solid fa-mug-hot icon-logo"></i>
            <NavLink exact to="/" className="nav-text gogginn-logo">GoggInn</NavLink>
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
