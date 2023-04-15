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

const deleteReview = (reviewId) => {
    return {
        type: DELETE_REVIEW,
        reviewId
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

export const addReviewFxn = (spotId, review) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${spotId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review),
      });

      if (res.ok) {
        const newReview = await res.json();
        console.log('this is addReview thunk', newReview);
        dispatch(addReviews({...newReview, spotId}));
        console.log('this is after dispatch', newReview)
        return newReview;
      }
}

export const updateReviewFxn = (review) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${review.id}`, {
      method: 'PUT',
      body: JSON.stringify(review),
    });

    if (res.ok) {
      const updatedReview = await res.json();
      console.log('this is updateReview thunk', updatedReview);
      dispatch(updateReviews(updatedReview));
      return updatedReview;
    }
};

export const deleteReviewFxn = (review) => async(dispatch) => {
    const res = await csrfFetch(`/api/spots/${review.spotId}/reviews/${review.id}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        const deletedReview = res.json();
        dispatch(deleteReview(deletedReview));
        return deletedReview
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
        case ADD_REVIEWS:
            const spotId = action.newReview.spotId
            const newReview = action.newReview
            const existingReviews = newState.reviews[spotId] || {}
            const addReview = {
                ...existingReviews,
                [newReview.id]: newReview
            }
            return {
                ...newState,
                reviews: {
                    ...newState.reviews,
                    [spotId]: addReview
                }
            }
        case UPDATE_REVIEW:
            return {
                ...newState,
                reviews: {
                    ...newState.reviews,
                    [action.review.id]: action.review
                },
            };
        case DELETE_REVIEW:
            delete newState.reviews[action.reviewId];
            return newState;
        default:
            return state;
    }
}

export default reviewReducer
