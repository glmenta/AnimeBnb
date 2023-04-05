import { csrfFetch } from './csrf';

const GET_SPOTS = 'spot/getSpots';
const CREATE_SPOT = 'spot/createSpot';
const GET_SPOT_DETAILS = 'spot/getSpotDetails'

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
export const getSpotDetails = (spotDetails) => {
  return {
    type: GET_SPOT_DETAILS,
    spotDetails
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

export const getSpotDetailsFxn = (spotId) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${spotId}`);

  if (response.ok) {
    const spotDetails = await response.json();
    console.log('spotDetails', spotDetails)
    console.log('this is the spotId', spotId)
    dispatch(getSpotDetails(spotDetails))
    return spotDetails
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
  console.log('initial state', state.spots)
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
    case GET_SPOT_DETAILS:
        newState = Object.assign({}, state);
        // if (newState.spots) {
        //   const updatedSpots = newState.spots.map(spot => {
        //     if (spot.id === action.spot.id) {
        //       return action.spot;
        //     }
        //     return spot;
        //   });
        //   newState.spots = updatedSpots;
        // }
        newState.spots = action.payload;
        return newState;
    default:
      return state
  }
}

export default spotReducer
