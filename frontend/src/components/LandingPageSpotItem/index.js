import React from 'react';
import './SpotItem.css';

const LandingPageSpotItem = ({ spot }) => {

  return (
    <>
        <img className='spot-image' src={`${spot.previewImage}`} alt={`${spot.name}`} />
        <div className='spot-name-rating'>
            <p>{spot.name}</p>
            <p>
                <i className="fa-sharp fa-solid fa-star"></i>
                {!isNaN(spot.avgRating) ? <b>{spot.avgRating}</b> : <b>New</b>}
            </p>
        </div>
        <div className='spot-price'>
            <p><b>${Number.parseFloat(spot.price).toFixed(2)}</b>/night</p>
        </div>
    </>
  );
};

export default LandingPageSpotItem;
