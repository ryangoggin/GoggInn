import { csrfFetch } from "./csrf";

// types:
const LOAD_SPOTS = 'spot/LOAD_SPOTS';

// POJO action creators:
// Feature 1: Landing Page All Spots
const loadSpots = spots => ({
    type: LOAD_SPOTS,
    spots
  });

// thunk action creators:
// Feature 1: Landing Page All Spots
export const getAllSpots = () => async dispatch => {
    const response = await csrfFetch(`/api/spots`);

    if (response.ok) {
      const allSpots = await response.json();
      dispatch(loadSpots(allSpots));
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
    default:
      return state;
  }
};

export default spotReducer;
