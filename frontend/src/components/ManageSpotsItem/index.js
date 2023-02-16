import React from 'react';
import './ManageSpotsItem.css';

const ManageSpotsItem = ({ spot }) => {

  return (
    <>
        <img className='spot-image' src={`${spot.previewImage}`} alt={`${spot.name}`} />
        <div className='spot-info-top'>
            <p>{spot.name}</p>
            <p>
                <i className="fa-sharp fa-solid fa-star"></i>
                {!isNaN(spot.avgRating) ? <b>{spot.avgRating}</b> : <b>New</b>}
            </p>
        </div>
    </>
  );
};

export default ManageSpotsItem;
