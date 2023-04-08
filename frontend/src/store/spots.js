import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots';
const CREATE_SPOT = 'spots/createSpot';
const GET_SPOT_DETAILS = 'spots/getSpotDetails'

export const getSpots = (spots) => {
    return {
      type: GET_SPOTS,
      spots
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
        let spotsObj = {}
        console.log(spotData)
        spotData.Spots.forEach(spot => {
          spotsObj[spot.id] = spot
        })
        console.log('this is spots', spotData);
        dispatch(getSpots(spotsObj))
        return spotsObj
    }
}

export const getSpotDetailsFxn = (spotId) => async (dispatch) => {

  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'GET'
  });

  if (response.ok) {
    const spotDetails = await response.json();
    console.log('spotDetails', spotDetails)
    console.log('this is the spotId', spotId)
    dispatch(getSpotDetails(spotDetails))
    return spotDetails
  }
}

export const createSpotFxn = (spot) => async (dispatch) => {
    console.log('thunk fxn spot', spot)
    const response = await csrfFetch('/api/spots', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spot)
     })

    if(response.ok) {
        const newSpot = await response.json()
        // console.log(spot)
        console.log('thunk new spot', newSpot)
        dispatch(createSpot(newSpot))
        return newSpot;
    }
}

const initialState = { spots: [] }

const spotReducer = (state = initialState, action) => {
  //console.log('initial state', state.spots)
  let newState = { ...state }
  //let newState;
  switch (action.type) {
    case GET_SPOTS:
      //newState = Object.assign({}, state);
      newState.spots = action.spots;
      return newState;
    case CREATE_SPOT:
      //newState = Object.assign({}, state)
      console.log('this is state.spots', state.spots)
      //newState.spots = Array.isArray(state.spots) ? [...state.spots, action.spot] : [action.spot]
      //newState = state.spots.push(Object.values(newState.spots[0]))
      //newState.spots = [...state.spots, action.spot]
      newState[action.spot.id] = action.spot
      console.log('this is newState.spots', newState.spots)
      return newState
      // return {...newState,
      //   spots: [...state.spots, action.spot]
      // }
    case GET_SPOT_DETAILS:
        //newState = Object.assign({}, state);
        newState.spotDetails = action.spotDetails;
        console.log('this is newState', newState)
        return newState;
    default:
      return state
  }
}

export default spotReducer
