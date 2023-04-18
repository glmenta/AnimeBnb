import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots';
const CREATE_SPOT = 'spots/createSpot';
const GET_SPOT_DETAILS = 'spots/getSpotDetails';
const GET_SPOT_ID = 'spots/getSpotId';
const UPDATE_SPOT = '/spots/updateSpot';
const DELETE_SPOT = '/spots/deleteSpot';

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

export const getSpotId = (spot) => {
  return {
    type: GET_SPOT_ID,
    spot
  }
}

export const updateSpot = (spot) => {
  return {
    type: UPDATE_SPOT,
    spot
  }
}

export const deleteSpot = (spot) => {
  return {
    type: DELETE_SPOT,
    spot
  }
}
export const getSpotsFxn = () => async (dispatch) => {
    const response = await csrfFetch('/api/spots')

    if (response.ok) {
        const spotData = await response.json()
        let spotsObj = {}
        spotData.Spots.forEach(spot => {
          spotsObj[spot.id] = spot
        })
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
    dispatch(getSpotDetails(spotDetails))
    return spotDetails
  }
}

export const createSpotFxn = (spot, images) => async (dispatch) => {

    const response = await csrfFetch('/api/spots/new', {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(spot)
     })

    if(response.ok) {
        const newSpot = await response.json()
        //this newSpot has no access to the images yet

        const imageResponses = await Promise.all(
          images.map((img) =>
            csrfFetch(`/api/spots/${newSpot.id}/images`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(img),
            })
          )
        );

        const imageUrls = await Promise.all(
          imageResponses.map(async (res) => {
            if (res.ok) {
              const img = await res.json();
              return img.url;
            }
            return null;
          })
        );

        newSpot.images = imageUrls.filter((url) => url !== null);

        await dispatch(createSpot(newSpot));
        return newSpot;
    }
}

export const getSpotIdFxn = (id) => async (dispatch) => {
  const res = await fetch(`/api/spots/${id}`)
  if (res.ok) {
    const data = await res.json();
    console.log('this is spotIdFxn', data);
    dispatch(getSpotId(data))
  }
}

export const updateSpotFxn = (updatedSpot, spotId) => async dispatch => {

  const response = await csrfFetch(`/api/spots/${spotId}/edit`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedSpot),
  });

  if (response.ok) {
    const updatedSpot = await response.json();

    await dispatch(updateSpot(updatedSpot));
    return updatedSpot;
  }
}

export const deleteSpotFxn = (spotId) => async dispatch => {
  const res = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    const deletedSpot = await res.json()
    dispatch(deleteSpot(deletedSpot))
    return deletedSpot;
  }
}

const initialState = { spots: [] }

const spotReducer = (state = initialState, action) => {
  let newState = { ...state }
  switch (action.type) {
    case GET_SPOTS:
      newState.spots = action.spots;
      return newState;
    case CREATE_SPOT:
      newState[action.spot.id] = action.spot
      return newState
    case GET_SPOT_DETAILS:
        newState.spotDetails = action.spotDetails;
        return newState;
    case UPDATE_SPOT:
      const spotId = action.spot.id;
      const spotToUpdate = newState.spots[spotId];

      if (spotToUpdate) {
        newState[spotId] = action.spot
      } else {
        return newState;
      }
      case DELETE_SPOT:
        // delete newState.spots[action.spotId];
        // return newState;
        const newSpots = newState.spots.filter(spot => spot.id !== action.spotId);
        return {
            ...newState,
            spots: newSpots
        }
    default:
      return state
  }
}

export default spotReducer
