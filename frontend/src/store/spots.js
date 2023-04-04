import { csrfFetch } from './csrf';

const GET_SPOTS = 'session/getSpots';
const CREATE_SPOT = 'session/createSpot';

export const getSpots = (spots) => {
    return {
      type: GET_SPOTS,
      payload: spots
    }
}

export const createSpot = (spot) => {
    return {
      type: CREATE_SPOT,
      spot
    }
}

export const getSpotsFxn = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')

    if (response.ok) {
        const spotData = await response.json()
        console.log('this is spots', spotData);
        dispatch(getSpots(spotData))
        return spotData
    }
}

export const createSpotFxn = (payload) => async (dispatch) => {
    const response = await csrfFetch('/api/spots', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })

    if(response.ok) {
        const spot = await response.json()
        dispatch(createSpot(spot))
    }
}

const initialState = {}

const spotReducer = (state = initialState, action) => {
  let newState = { ...state }
  switch (action.type) {
    case GET_SPOTS:
        newState = Object.assign({}, state);
        newState.spots = action.payload;
        return newState;
    case CREATE_SPOT:
        newState = Object.assign({}, state)
        newState.spots = [...state.spots, action.spot]
        return newState
    default:
      return state
  }
}

export default spotReducer
