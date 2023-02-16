import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { getAllSpots, getSpotDetail } from '../../store/spot';
import { getSpotReviews } from '../../store/review';
import './SpotDetails.css';


const SpotDetails = () => {
  const { spotId } = useParams();
  const spot = useSelector(state => state.spot.singleSpot);

  const dispatch = useDispatch();

  // populate store with allSpots and singleSpot on render in case of refresh on spotDetails page
  useEffect(() => {
    dispatch(getAllSpots());
    dispatch(getSpotDetail(spotId));
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  // check session user exists, hasn't posted a review, or isn't the spot owner in ternary to hide post review button or not
  const sessionUser = useSelector(state => state.session.user);
  const spotReviews = useSelector(state => state.review.spot);
  if (spotReviews === null) return null; //return null to avoid null going into Object.values
  const spotReviewsArr = Object.values(spotReviews);
  // map an array of all user's who have left reviews to check if curr user is in array
  const usersSpotReviewsArr = spotReviewsArr.map(spotReview => spotReview.userId);

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
        <img key={`spotImageId${bigSpotImage.id}`} className={(smallSpotImages.length > 0) ? 'big-image' : 'big-image-only'} src={bigSpotImage.url} alt={`spotImage #${bigSpotImage.id}`} />
      </div>
      <div className={(smallSpotImages.length > 0) ? 'small-images-container' : 'hidden'}>
        {smallSpotImages.map((spotImage) => {
            return (
              <img key={`spotImageId${spotImage.id}`} className='small-image' src={spotImage.url} alt={`spotImage #${spotImage.id}`} />
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
              <div className='rating-reviews'>
                <p>
                  <i className="fa-sharp fa-solid fa-star"></i>
                  {!isNaN(spot.avgStarRating) ? <b>{spot.avgStarRating}</b> : <b>New</b>}
                </p>
                <p className={spot.numReviews === 0 ? "hidden": "centered-dot"}>
                  <b>·</b>
                </p>
                <p>
                  <b className={spot.numReviews === 0 ? "hidden": ""}>{spot.numReviews === 1 ? `${spot.numReviews} Review` : `${spot.numReviews} Reviews`}</b>
                </p>
              </div>
            </div>
            <div className='bottom-callout-info-box'>
              <button className="reserve-button" onClick={handleReserve}>Reserve</button>
            </div>
          </div>
        </div>
    </div>
    <div className='spot-reviews-container'>
      <div className='big-rating-reviews'>
        <h2>
          <i className="fa-sharp fa-solid fa-star big-star"></i>
          {!isNaN(spot.avgStarRating) ? <b>{spot.avgStarRating}</b> : <b>New</b>}
        </h2>
        <h2 className={spot.numReviews === 0 ? "hidden": "centered-dot"}>
          <b>·</b>
        </h2>
        <h2>
          <b className={spot.numReviews === 0 ? "hidden": ""}>{spot.numReviews === 1 ? `${spot.numReviews} Review` : `${spot.numReviews} Reviews`}</b>
        </h2>
      </div>
      <div className={(sessionUser === null || spot.id === sessionUser.id || usersSpotReviewsArr.includes(sessionUser.id)) ? 'hidden' : 'post-review-button-container'}>
          <button className='post-review-button'> Post your Review </button>
      </div>
      <div className={spot.numReviews === 0 ? "no-reviews-container" : "hidden"}>
          <p className='no-reviews'>Be the first to post a review!</p>
      </div>
      {spotReviewsArr.map((spotReview) => {
          return (
            <div key={`spotReviewId${spotReview.id}`} className='spot-review-container'>
                <div className='spot-review'>
                  <h3 className='spot-review-name'>{spotReview.User.firstName}</h3>
                  <h4 className='spot-review-date'>{spotReview.createdAt.slice(0, 10)}</h4>
                  <p className='spot-review-text'>{spotReview.review}</p>
                </div>
            </div>
          );
        })}
    </div>
    </>
  );
}

export default SpotDetails;
