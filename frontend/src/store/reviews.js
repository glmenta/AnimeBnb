import { csrfFetch } from './csrf'

const GET_REVIEWS = 'reviews/GET_REVIEWS';
const ADD_REVIEWS = 'reviews/ADD_REVIEWS';
const UPDATE_REVIEW = 'reviews/UPDATE_REVIEWS';
const DELETE_REVIEW = 'reviews/DELETE_REVIEWS';

const getReviews = (reviews) => {
    return {
        type: GET_REVIEWS,
        reviews
    }
}

const addReviews = (newReview) => {
    return {
        type: ADD_REVIEWS,
        newReview
    }
}

const updateReviews = (review) => {
    return {
        type: UPDATE_REVIEW,
        review
    }
}

export const getReviewsFxn = (spotId) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`)

    if (res.ok) {
        const reviewData = await res.json();
        console.log('this is getReviews thunk', reviewData)
        dispatch(getReviews(reviewData));
        return reviewData
    }
}

const initialState = { reviews: {} }

const reviewReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch(action.type) {
        case GET_REVIEWS:
            return {
                ...newState,
                reviews: action.reviews
            }
        default:
            return state;
    }
}

export default reviewReducer
