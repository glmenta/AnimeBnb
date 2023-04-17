import { useDispatch, useSelector } from "react-redux";
import { deleteReviewFxn } from "../../../store/reviews";
import React, {useEffect, useState} from "react";
import { useModal } from "../../../context/Modal";
import { useParams, useHistory } from "react-router-dom";
import "./DeleteReviewModal.css"
function DeleteReviewModal ({isOpen, onClose, reviewId, spotId}) {
    const dispatch = useDispatch();
    const history = useHistory();

    const reviews = useSelector(state => Object.values(state.review.reviews))
    const [hasDeleted, setHasDeleted] = useState(false)

    const handleDelete = () => {
        if(reviews) {
            return dispatch(deleteReviewFxn(reviewId))
            //.then(() => {history.push(`/spots/${spotId}`)})
            // .then(() => {
            //     setHasDeleted(true)
            // })
            .then(history.go(0))
        }
    }

    const cancelDelete = () => {
        onClose();
    }

    // useEffect(() => {
    //     if (hasDeleted) {
    //       history.push(`/spots/${spotId}`);
    //     }
    //   }, [hasDeleted, history, spotId]);

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
