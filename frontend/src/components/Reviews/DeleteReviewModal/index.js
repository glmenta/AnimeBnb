import { useDispatch } from "react-redux";
import { deleteReviewFxn } from "../../../store/reviews";
import React, {useState} from "react";
import { useModal } from "../../../context/Modal";

function DeleteReviewModal ({isOpen, onClose, spotId}) {

    const dispatch = useDispatch();
    const { setModalContent } = useModal();

    const handleDelete = () => {
        return dispatch(deleteReviewFxn())
            .then(setModalContent(null))

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
                    <button onClick={() => setModalContent(null)}>No (Keep Review)</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteReviewModal;
