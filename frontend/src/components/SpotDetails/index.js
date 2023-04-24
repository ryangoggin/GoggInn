import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import OpenModalMenuItem from '../Navigation/OpenModalMenuItem';
import CreateReviewModal from '../CreateReviewModal';
import DeleteReviewModal from '../DeleteReviewModal';
import { getAllSpots, getSpotDetail, clearSingleSpot } from '../../store/spot';
import { getSpotReviews } from '../../store/review';
import './SpotDetails.css';


const SpotDetails = () => {
  const { spotId } = useParams();
  const spot = useSelector(state => state.spot.singleSpot);

  const dispatch = useDispatch();

  //use the following for create review modal
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  useEffect(() => {
      if (!showMenu) return;

      const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
          setShowMenu(false);
      }
      };

      document.addEventListener('click', closeMenu);

      return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  // populate store with allSpots and singleSpot on render in case of refresh on spotDetails page
  useEffect(() => {
    dispatch(getAllSpots());
    dispatch(clearSingleSpot());
    dispatch(getSpotDetail(spotId));
    dispatch(getSpotReviews(spotId));
  }, [dispatch, spotId]);

  // check session user exists, hasn't posted a review, or isn't the spot owner in ternary to hide post review button or not
  const sessionUser = useSelector(state => state.session.user);
  const spotReviews = useSelector(state => state.review.spot);
  if (spotReviews === null) return null; //return null to avoid null going into Object.values
  let spotReviewsArr = Object.values(spotReviews);
  spotReviewsArr = spotReviewsArr.reverse(); // reverse for newest at top
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

  if (smallSpotImages) {
    smallSpotImages = smallSpotImages.filter(spotImage => spotImage.id !== undefined);
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
    <div className='spot-images-container'>
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
      <div className={(sessionUser === null || spot.Owner.id === sessionUser.id || usersSpotReviewsArr.includes(sessionUser.id)) ? 'hidden' : 'post-review-button-container'}>
          <button className='post-review-button'>
            <OpenModalMenuItem
                itemText="Post Your Review"
                onItemClick={closeMenu}
                modalComponent={<CreateReviewModal spotId={spot.id} />}
            />
          </button>
      </div>
      <div className={(spot.numReviews === 0 && sessionUser !== null) ? "no-reviews-container" : "hidden"}>
          <p className='no-reviews'>{sessionUser === null ? "This spot has no reviews yet (this will be hidden)" : (spot.Owner.id === sessionUser.id ? "Your spot has no reviews yet" : "Be the first to post a review!")}</p>
      </div>
      {spotReviewsArr.map((spotReview) => {
          return (
            <div key={`spotReviewId${spotReview.id}`} className={(sessionUser === null) ? 'spot-review-container' : (sessionUser.id === spotReview.User.id ? 'spot-review-container-with-delete' : 'spot-review-container')}>
                <div className={(sessionUser === null) ? 'spot-review' : (sessionUser.id === spotReview.User.id ? 'spot-review-with-delete' : 'spot-review')}>
                  <h3 className='spot-review-name'>{spotReview.User.firstName}</h3>
                  <h4 className='spot-review-date'>{new Date(spotReview.createdAt).toISOString().slice(0, 10)}</h4>
                  <p className='spot-review-text'>{spotReview.review}</p>
                </div>
                <button className={(sessionUser === null) ? "hidden" : (sessionUser.id === spotReview.User.id ? "delete-review-button" : "hidden")}>
                <OpenModalMenuItem
                    itemText="Delete"
                    onItemClick={closeMenu}
                    modalComponent={<DeleteReviewModal reviewId={spotReview.id} />}
                />
                </button>
            </div>
          );
        })}
    </div>
    </>
  );
}

export default SpotDetails;
