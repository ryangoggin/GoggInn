import React from 'react';
import './SpotItem.css';

const LandingPageSpotItem = ({ spot }) => {

  return (
    <>
        <img className='spot-image' src={`${spot.previewImage}`} alt={`${spot.name}`} />
        <div className='spot-loc-rating'>
            <p>{spot.city}, {spot.state}</p>
            <p>
                <i class="fa-sharp fa-solid fa-star"></i>
                {!isNaN(spot.avgRating) ? spot.avgRating : "No Reviews Yet"}
            </p>
        </div>
        <div className='spot-price'>
            <p>${spot.price}</p>
        </div>
    </>
  );
};

export default LandingPageSpotItem;
