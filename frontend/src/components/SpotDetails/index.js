import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots, getSpotDetail } from '../../store/spot';
import './SpotDetails.css';

const SpotDetails = () => {
  const { spotId } = useParams();
  const spot = useSelector(state => state.spot.singleSpot);

  const dispatch = useDispatch();

  // populate store with allSpots and singleSpot on render in case of refresh on spotDetails page
  useEffect(() => {
    dispatch(getAllSpots());
    dispatch(getSpotDetail(spotId));
  }, [dispatch, spotId]);

  // return null if spot is null from initialState on page refresh
  if (spot === null) return null;

  // make bigImage the preview image, and first
  let smallSpotImages = [];
  let bigSpotImage;
  if (spot) {
    for (let i = 0; i < 5; i++) {
      if (spot.SpotImages[i]) {
        (spot.SpotImages[i].preview && !bigSpotImage) ? bigSpotImage = spot.SpotImages[i] : smallSpotImages.push(spot.SpotImages[i]);
      }
      // if there isn't a preview image, first image is big and next 4 are small
      if (i === 5 && !bigSpotImage) {
        bigSpotImage = spot.SpotImages[0];
        smallSpotImages = spot.SpotImages.slice(1, 5);
      }
    }
  }

  const handleReserve = (e) => {
    e.preventDefault();
    window.alert('Feature Coming Soon...');
  }

  return (
    <>
    <div className='spot-details-header'>
      <h1>{spot.name}</h1>
      <h3>{spot.city}, {spot.state}, {spot.country}</h3>
    </div>
    <div className={(smallSpotImages.length > 0) ? 'spot-details-image-container': 'big-image-only-container'}>
      <div className={(smallSpotImages.length > 0) ? 'big-image-container' : 'big-image-only-sub-container'}>
        <img key={bigSpotImage.id} className={(smallSpotImages.length > 0) ? 'big-image' : 'big-image-only'} src={bigSpotImage.url} alt={`spotImage #${bigSpotImage.id}`} />
      </div>
      <div className={(smallSpotImages.length > 0) ? 'small-images-container' : 'hidden'}>
        {smallSpotImages.map((spotImage) => {
            return (
              <img key={spotImage.id} className='small-image' src={spotImage.url} alt={`spotImage #${spotImage.id}`} />
            );
          })}
      </div>
    </div>
    <div className='spot-info-container'>
          <div className='left-side-info'>
          <h2>Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</h2>
          <p>{spot.description}</p>
          </div>
          <div className='callout-info-box-container'>
            <div className='callout-info-box'>
              <div className='top-callout-info-box'>
                <p><b>${spot.price}</b>/night</p>
                <p>
                  <i className="fa-sharp fa-solid fa-star"></i>
                  {!isNaN(spot.avgRating) ? <b>{spot.avgRating}</b> : <b>New</b>}
                </p>
              </div>
              <div className='bottom-callout-info-box'>
                <button className="reserve-button" onClick={handleReserve}>Reserve</button>
              </div>
            </div>
          </div>
    </div>
    </>
  );
}

export default SpotDetails;
