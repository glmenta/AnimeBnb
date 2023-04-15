import { useDispatch, useSelector } from "react-redux";
import { deleteSpotFxn } from "../../../store/reviews";
import React, {useState} from "react";
import { useModal } from "../../../context/Modal";
import './DeleteSpotModal.css';

function DeleteSpotModal ({isOpen, onClose, spotId}) {
    const dispatch = useDispatch();
    const { closeModal } = useModal();

    const unfilteredSpots = useSelector(state => Object.values(state.spot.spots))
    console.log('this is unfiltered', unfilteredSpots)
    const handleDelete = () => {
        return dispatch()

    }

    const cancelDelete = () => {
        onClose();
    }

    if (!isOpen) {
        return null
    }


    return (
        <div className='delete-spot-modal-container' onClick={onClose}>
            <div className='delete-spot-modal' onClick={(e) => e.stopPropagation()}>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this spot from the listings</p>
                <div className='yes-button'>
                    <button onClick={handleDelete}>Yes (Delete Spot)</button>
                </div>
                <div className='no-button'>
                    <button onClick={cancelDelete}>No (Keep Spot)</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteSpotModal;
