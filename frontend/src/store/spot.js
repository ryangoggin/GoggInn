import { csrfFetch } from "./csrf";

// types:
const LOAD_SPOTS = 'spot/LOAD_SPOTS';
const LOAD_SINGLE_SPOT = 'spot/LOAD_SINGLE_SPOT';

// POJO action creators:
// Feature 1: Landing Page All Spots
const loadSpots = spots => ({
    type: LOAD_SPOTS,
    spots
});

// Feature 1: Spot Details
const loadSingleSpot = spot => ({
    type: LOAD_SINGLE_SPOT,
    spot
})

// thunk action creators:
// Feature 1: Landing Page All Spots
export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
      const allSpots = await response.json();
      dispatch(loadSpots(allSpots));
    }
};

// Feature 1: Spot Details
export const getSpotDetail = (id) => async dispatch => {
  const res = await fetch(`/api/spots/${id}`);

  if (res.ok) {
    const spot = await res.json();
    dispatch(loadSingleSpot(spot));
  }
};

const initialState = { allSpots: null, singleSpot: null };

// can add sortList function to sort spots --> refer to pokedex

const spotReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_SPOTS:
        const allSpots = {};
        const spotsArr = Object.values(action.spots)[0]; //only take first index to exclude page and size
        spotsArr.forEach(spot => {
          allSpots[spot.id] = spot;
        });
        return {
          ...state,
          allSpots: allSpots
        };
    case LOAD_SINGLE_SPOT:
        const singleSpot = action.spot;
        return {
          ...state,
          singleSpot: singleSpot
        }
    default:
      return state;
  }
};

export default spotReducer;
