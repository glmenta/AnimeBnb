import { csrfFetch } from './csrf';

const GET_SPOTS = 'spot/getSpots';
const CREATE_SPOT = 'spot/createSpot';
const GET_SPOT_DETAILS = 'spot/getSpotDetails'

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
        console.log('this is spots', spotData);
        dispatch(getSpots(spotData))
        return spotData
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
  // const {
  //   country,
  //   address,
  //   city,
  //   state,
  //   description,
  //   name,
  //   price,
  //   previewImage,
  //   image1,
  //   image2,
  //   image3,
  //   image4,
  //   image5
  //  } = spot
    const response = await csrfFetch('/api/spots', {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spot)
      // body: JSON.stringify({
      //   country,
      //   address,
      //   city,
      //   state,
      //   description,
      //   name,
      //   price,
      //   previewImage,
      //   image1,
      //   image2,
      //   image3,
      //   image4,
      //   image5
      // })
    })

    if(response.ok) {
        const newSpot = await response.json()
        // console.log(spot)
        dispatch(createSpot(newSpot))
        //return newSpot;
    }
}

const initialState = { spots: []}

const spotReducer = (state = initialState, action) => {
  //console.log('initial state', state.spots)
  let newState = { ...state }
  switch (action.type) {
    case CREATE_SPOT:
      newState = Object.assign({}, state)
      console.log('this is state.spots', state.spots)
      newState.spots = Array.isArray(state.spots) ? [...state.spots, action.spot] : [action.spot]
      return newState
    case GET_SPOTS:
        newState = Object.assign({}, state);
        newState.spots = action.spots;
        return newState;

    case GET_SPOT_DETAILS:
        // newState = Object.assign({}, state);
        newState.spotDetails = action.spotDetails;
        console.log('this is newState', newState)
        return newState;
    default:
      return state
  }
}

export default spotReducer
