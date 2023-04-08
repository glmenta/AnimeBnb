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
    const res = await csrfFetch(`api/spots/${spotId}/reviews`)

    if (res.ok) {
        const reviewData = await res.json();
        dispatch(getReviews);
        return reviewData
    }
}

const initialState = { reviews: {} }

const reviewReducer = (state = initialState, action) => {
    let reviews;
    switch(action.type) {
        case GET_REVIEWS:
            reviews = {
                ...state,
                currentReviews: {
                ...state.currentReviews
                }
            }
            let review = {}
            let reviewList = action.review.Reviews;
            reviewList.forEach((review) => (review[review.id] = review))
            reviews.currentReviews = {...review}
            return reviews
        default:
            return state;
    }
}

export default reviewReducer
