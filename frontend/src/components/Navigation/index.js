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
            <NavLink exact to="/" className="nav-text gogginn-logo">
              <i className="fa-solid fa-mug-hot icon-logo"></i>
              GoggInn
            </NavLink>
          </li>
          <ul className='right-nav'>
          { sessionUser !== null && (
            <li className="create-new-spot">
            <NavLink exact to="/spots/new" className="create-new-spot nav-text">
              Create a New Spot
            </NavLink>
            </li>
          )}
          {isLoaded && (
              <li>
              <ProfileButton user={sessionUser} />
              </li>
          )}
          </ul>
        </ul>
    </div>
  );
}

export default Navigation;
