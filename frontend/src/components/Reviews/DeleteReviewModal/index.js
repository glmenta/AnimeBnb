import { useDispatch, useSelector } from "react-redux";
import { deleteReviewFxn } from "../../../store/reviews";
import React, {useState} from "react";
import { useModal } from "../../../context/Modal";
import { useParams, useHistory } from "react-router-dom";
import "./DeleteReviewModal.css"
function DeleteReviewModal ({isOpen, onClose, reviewId, spotId}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const reviews = useSelector(state => Object.values(state.review.reviews))
    const { closeModal } = useModal();

    console.log('this is reviewId from del rev modal', reviewId)
    console.log('this is reviews from del rev modal', reviews)
    console.log(spotId)
    const handleDelete = () => {

        if(reviews) {
            return dispatch(deleteReviewFxn(reviewId))
            .then(() => {history.push(`/spots/${spotId}`)})
        }
    }

    const cancelDelete = () => {
        onClose();
    }

    if (!isOpen) {
        return null
    }

    return (
        <div className='remove-review-modal-container'>
            <div className='remove-review-modal'>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this review</p>
                <div className='yes-button'>
                    <button onClick={handleDelete}>Yes (Delete Review)</button>
                </div>
                <div className='no-button'>
                    <button onClick={cancelDelete}>No (Keep Review)</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteReviewModal;
