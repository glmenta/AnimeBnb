import { useDispatch, useSelector } from "react-redux";
import React, {useState} from "react";
import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";
import './DeleteSpotModal.css';

function DeleteSpotModal ({isOpen, onClose, onDelete}) {
    const dispatch = useDispatch();
    const history = useHistory();

    if (!isOpen) {
        return null
    }

    const handleDelete = () => {
        onDelete();
        // history.go(0)
    }

    return (
        <div className='delete-spot-modal-container'>
            <div className='delete-spot-modal' onClick={(e) => e.stopPropagation()}>
                <h2>Confirm Delete</h2>
                <p>Are you sure you want to delete this spot from the listings</p>
                <div className='yes-button'>
                    <button onClick={handleDelete}>Yes (Delete Spot)</button>
                </div>
                <div className='no-button'>
                    <button onClick={onClose}>No (Keep Spot)</button>
                </div>
            </div>
        </div>
    )
}

export default DeleteSpotModal;
