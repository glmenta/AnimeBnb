import { csrfFetch } from './csrf'
import { getSpotDetailsFxn } from './spots';

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

const addReviews = (spotId, newReview) => {
    return {
        type: ADD_REVIEWS,
        spotId,
        newReview,
    };
};


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

        dispatch(getReviews(reviewData));
        return reviewData
    }
}

export const addReviewFxn = (spotId, review) => async (dispatch) => {
    const numericSpotId = Number(spotId);

    try {
        const res = await csrfFetch(`/api/spots/${numericSpotId}/reviews`, {
            method: 'POST',
            body: JSON.stringify(review),
        });

        if (res.ok) {
            // Assuming the response is in JSON format
            const newReview = await res.json();

            dispatch(addReviews(numericSpotId, newReview));
            dispatch(getReviewsFxn(numericSpotId));

            return newReview.id;
        } else {
            // Handle non-OK responses
            throw res;
        }
    } catch (error) {
        // Handle errors, including non-JSON responses
        console.error('Error adding review:', error);
        throw error; // Rethrow the error for the calling function to handle
    }
};


export const updateReviewFxn = (review) => async (dispatch) => {
    const res = await csrfFetch(`/api/reviews/${review.id}`, {
    method: 'PUT',
    body: JSON.stringify(review),
    });

    if (res.ok) {
        const updatedReview = await res.json();

        dispatch(updateReviews(updatedReview));
        return updatedReview;
    }
};

export const deleteReviewFxn = (reviewId) => async(dispatch) => {
    const res = await csrfFetch(`/api/reviews/${reviewId}`, {
        method: 'DELETE'
    })

    if (res.ok) {
        const deletedReview = await res.json();

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
            const { spotId, newReview } = action;
            const existingReviews = newState.reviews[spotId] || [];
            const updatedReviews = [...existingReviews, newReview];
            console.log('Updated Reviews:', updatedReviews);
            console.log('Updated numReviews:', updatedReviews.length);
            // const updatedSpotDetail = {
            //     ...newState.spotDetails[spotId],
            //     numReviews: updatedReviews.length,
            // };
            //console.log('Updated Spot Detail:', updatedSpotDetail);
                return {
                ...newState,
                reviews: {
                    ...newState.reviews,
                    [spotId]: updatedReviews,
                },
            };

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
