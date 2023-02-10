import { csrfFetch } from "./csrf";
// Frontend Auth Me Phase 1:

// types:
const SET_USER = 'session/setUser';
const REMOVE_USER = 'session/removeUser';

// POJO action creators:
const setUser = (user) => {
    return {
      type: SET_USER,
      user
    };
};

export const removeUser = () => {
    return {
    type: REMOVE_USER
    };
};

// thunk action creators:
export const login = ({credential, password}) => async dispatch => {
    const res = await csrfFetch(`/api/session`, {
      method: "POST",
      body: JSON.stringify({credential, password})
    });

    if (res.ok) {
      const user = await res.json();
      dispatch(setUser(user));
      return res;
    }
};

export const restoreUser = () => async dispatch => {
    const response = await csrfFetch('/api/session');
    const data = await response.json();
    dispatch(setUser(data.user));
    return response;
};

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
    switch(action.type) {
      case SET_USER:
        return { user: action.user };
      case REMOVE_USER:
        return { user: null };
      default:
        return state;
    }
}

export default sessionReducer;
