import { csrfFetch } from "./csrf";

// types:
const LOAD_SPOTS = 'spot/LOAD_SPOTS';
const LOAD_SINGLE_SPOT = 'spot/LOAD_SINGLE_SPOT';
const ADD_SPOT = 'spot/ADD_SPOT';
const ADD_SPOT_IMAGES = 'spots/ADD_SPOT_IMAGES';
const LOAD_USER_SPOTS = 'spots/GET_USER_SPOTS';
const CLEAR_SINGLE_SPOT = 'spots/CLEAR_SINGLE_SPOT';
const EDIT_SPOT = 'spot/EDIT_SPOT';
const REMOVE_SPOT = 'spot/REMOVE_SPOT';

// POJO action creators:
// Feature 1: Landing Page All Spots
const loadSpots = spots => ({
    type: LOAD_SPOTS,
    spots
});

// Feature 2: Spot Details
const loadSingleSpot = spot => ({
    type: LOAD_SINGLE_SPOT,
    spot
});

// Feature 3: Create a Spot
const addSpot = spot => ({
    type: ADD_SPOT,
    spot
});

// Feature 3: Add Spot Images to Spot
const addSpotImages = (spot, spotImages) => ({
    type: ADD_SPOT_IMAGES,
    payload: {
      spot,
      spotImages
    }
});

// Feature 4: Manage Spots (Get Current User's Spots)
const loadUserSpots = userSpots => ({
  type: LOAD_USER_SPOTS,
  userSpots
});

// Feature 4: Manage Spots (Clear Single Spot on Manage Spots Dismount)
export const clearSingleSpot = () => ({
  type: CLEAR_SINGLE_SPOT
});

// Feature 4: Manage Spots (Edit Spot)
const editSpot = spot => ({
  type: EDIT_SPOT,
  spot
});

// Feature 4: Manage Spots (Delete Spot)
const removeSpot = spotId => ({
  type: REMOVE_SPOT,
  spotId
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

// Feature 2: Spot Details
export const getSpotDetail = (id) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${id}`);

  if (res.ok) {
    const spot = await res.json();
    dispatch(loadSingleSpot(spot));
    return spot;
  }
};

// Feature 3: Create a Spot
export const createSpot = (spot, spotImages) => async dispatch => {
  //keep spot.Owner for after DB strips it off:
  const spotOwner = spot.Owner;
  const resSpot = await csrfFetch(`/api/spots`, {
    method: "POST",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(spot)
  });

  if (resSpot.ok) {
    const spot = await resSpot.json();
    dispatch(addSpot(spot));

    const spotImagesArr = [];

    // POST to /api/spots/:spotId/images only takes one spotImage at a time
    for (let spotImage of spotImages) {
      const resImage = await csrfFetch(`/api/spots/${spot.id}/images`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify(spotImage)
      });

      if (resImage.ok) {
        const spotImage = await resImage.json();
        spotImagesArr.push(spotImage);
      }
    }

    // DB strips Owner from spot... readd here
    spot.Owner = spotOwner;

    dispatch(addSpotImages(spot, spotImagesArr));
    return spot; //return so can be accessed for rerouting
  }
};

// Feature 4: Manage Spots (Get Current User's Spots)
export const getUserSpots = () => async dispatch => {
  const response = await csrfFetch(`/api/spots/current`);

  if (response.ok) {
    const userSpots = await response.json();
    dispatch(loadUserSpots(userSpots));
  }
};

// Feature 4: Manage Spots (Update User Spot)
export const updateSpot = (spot, spotId) => async dispatch => {
  //keep spot.Owner for after DB strips it off:
  const spotOwner = spot.Owner;
  const spotSpotImages = spot.SpotImages;
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: "PUT",
    headers: { 'Content-Type': 'application/json'},
    body: JSON.stringify(spot)
  });

  if (res.ok) {
    const spot = await res.json();
    // DB strips SpotImages from spot... readd here
    spot.SpotImages = spotSpotImages;
    // DB strips Owner from spot... readd here
    spot.Owner = spotOwner;
    dispatch(editSpot(spot));

    return spot; //return so can be accessed for rerouting
  }
};

// Feature 4: Manage Spots (Delete USer Spot)
export const deleteSpot = (spotId) => async dispatch => {
    const res = await csrfFetch(`/api/spots/${spotId}`, {
      method: "DELETE"
    });

    if (res.ok) {
      //don't need DELETE res, it is just a success message
      dispatch(removeSpot(spotId));
    }
};

const initialState = { allSpots: null, singleSpot: null, userSpots: null };

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
        };
    case ADD_SPOT:
        return {
          ...state,
          singleSpot: {
            ...action.spot
          }
        };
    case ADD_SPOT_IMAGES:
        return {
          ...state,
          singleSpot: {
              ...action.payload.spot,
              SpotImages: action.payload.spotImages
          }
        };
    case LOAD_USER_SPOTS:
        const userSpots = {};
        const userSpotsArr = action.userSpots.Spots;
        userSpotsArr.forEach(spot => {
          userSpots[spot.id] = spot;
        });
        return {
          ...state,
          userSpots: userSpots
        };
    case CLEAR_SINGLE_SPOT:
        return {
          ...state,
          singleSpot: null
        }
    case EDIT_SPOT:
        return {
          ...state,
          singleSpot: {
            ...action.spot
          }
        }
    case REMOVE_SPOT:
      const newUserSpots = {...state.userSpots};
      delete newUserSpots[action.spotId]
      return {
        ...state,
        userSpots: newUserSpots
      };
    default:
      return state;
  }
};

export default spotReducer;
