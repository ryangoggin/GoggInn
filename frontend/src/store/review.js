import { csrfFetch } from "./csrf";

// types
const LOAD_SPOT_REVIEWS = 'review/LOAD_SPOT_REVIEWS';
const ADD_SPOT_REVIEW = 'review/ADD_SPOT_REVIEW';
const REMOVE_SPOT_REVIEW = 'review/REMOVE_SPOT_REVIEW';


// POJO action creators
// Feature 5: Load Spot Reviews
const loadSpotReviews = reviews => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
});

// Feature 6: Add a Spot Review
const addSpotReview = review => ({
    type: ADD_SPOT_REVIEW,
    review
});

// Feature 7: Remove a Spot Review
const removeSpotReview = reviewId => ({
    type: REMOVE_SPOT_REVIEW,
    reviewId
});

// thunk action creators
// Feature 5: Get Spot Reviews
export const getSpotReviews = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`);

    if (res.ok) {
      const spotReviews = await res.json();
      dispatch(loadSpotReviews(spotReviews));
    }
};

// Feature 6: Create a Spot Review
export const createSpotReview = (review, spotId, sessionUser) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(review)
      });

    if (res.ok) {
      const spotReview = await res.json();
      //need to add User to spotReview after DB
      spotReview.User = {
        id: sessionUser.id,
        firstName: sessionUser.firstName,
        lastName: sessionUser.lastName
      }
      dispatch(addSpotReview(spotReview));
    }
};

// Feature 7: Delete a Spot Review
export const deleteReview = (reviewId) => async dispatch => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
      method: "DELETE"
    });

    if (res.ok) {
      //don't need DELETE res, it is just a success message
      dispatch(removeSpotReview(reviewId));
    }
};

// reducer's initial state
const initialState = { spot: null, user: null };

// reducer
const reviewReducer = (state = initialState, action) => {
    switch (action.type) {
      case LOAD_SPOT_REVIEWS:
        const allReviews = {};
        const reviewsArr = Object.values(action.reviews)[0];
        reviewsArr.forEach(review => {
          allReviews[review.id] = review;
        });
        return {
          ...state,
          spot: allReviews
        };
      case ADD_SPOT_REVIEW:
        const spotReviews = { ...state.spot };
        spotReviews[action.review.id] = action.review;
        return {
            ...state,
            spot: spotReviews
        }
      case REMOVE_SPOT_REVIEW:
        const newSpotReviews = {...state.spot};
        delete newSpotReviews[action.reviewId]
        return {
          ...state,
          spot: newSpotReviews
        };
      default:
        return state;
    }

  };

  export default reviewReducer;
