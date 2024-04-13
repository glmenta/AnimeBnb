import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bookingActions from '../../../store/bookings';
import { useHistory } from 'react-router-dom';


function DeleteBookingModal({ booking, isOpen, onClose }) {

    const dispatch = useDispatch();
    const history = useHistory();
    const bookingId = booking.booking.id;
    console.log('booking: ', booking.booking)
    const handleDeleteBooking = async (e) => {
        e.preventDefault();
        await dispatch(bookingActions.deleteBookingThunk(bookingId));
        history.push(`/users/${booking.userId}/bookings`);
    }

    return (
        isOpen &&
        <div>
            <p>Are you sure you want to delete this booking?</p>
            <button onClick={handleDeleteBooking}>Yes (Delete Booking)</button>
            <button onClick={onClose}>No (Keep Booking)</button>
        </div>
    )
}

export default DeleteBookingModal
