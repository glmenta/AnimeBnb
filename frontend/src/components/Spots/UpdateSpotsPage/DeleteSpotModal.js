import { useDispatch } from "react-redux";
import { } from "../../../store/reviews";
import React, {useState} from "react";
import { useModal } from "../../../context/Modal";

function DeleteSpotModal ({isOpen, onClose, spotId}) {

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
        <div className='delete-spot-modal-container'>
            <div className='delete-spot-modal'>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this spot from the listings</p>
                <div className='yes-button'>
                    <button onClick={handleDelete}>Yes (Delete Spot)</button>
                </div>
                <div className='no-button'>
                    <button onClick={() => setModalContent(null)}>No (Keep Spot)</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteSpotModal;
