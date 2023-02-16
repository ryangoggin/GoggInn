import { csrfFetch } from "./csrf";

// types
// Feature 5: Load Spot Reviews
const LOAD_SPOT_REVIEWS = 'review/LOAD_SPOT_REVIEWS';

// POJO action creators
// Feature 5: Load Spot Reviews
const loadSpotReviews = reviews => ({
    type: LOAD_SPOT_REVIEWS,
    reviews
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
      default:
        return state;
    }

  };

  export default reviewReducer;
