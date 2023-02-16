// Feature 1: Landing Page All Spots
import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots } from '../../store/spot';
import LandingPageSpotItem from '../LandingPageSpotItem';
import './AllSpots.css';

function LandingPageAllSpots(){
  const allSpots = useSelector(state => state.spot.allSpots);
  // allSpots starts as null, use conditional to avoid putting undefined in Object.values
  let allSpotsArr;
  if (allSpots !== null) {
    allSpotsArr = Object.values(allSpots);
  }

  const dispatch = useDispatch();

  //populate store with allSpots on render
  useEffect(() => {
    dispatch(getAllSpots());
  }, [dispatch]);

  if (!allSpotsArr) {
    return null;
  }

  return (
    <div className='all-spots-container'>
        {allSpotsArr.map((spot) => {
          return (
            <div key={`spotContainerId${spot.id}`} className='spot-item-container'>
                <div className='spot-item'>
                    <Link key={`spotId${spot.id}`} to={`/spots/${spot.id}`} style={{ textDecoration: 'none' }}>
                        <LandingPageSpotItem spot={spot}/>
                    </Link>
                </div>
            </div>
          );
        })}
    </div>
  );
}

export default LandingPageAllSpots;
