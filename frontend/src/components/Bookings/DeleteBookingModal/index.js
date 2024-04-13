import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bookingActions from '../../../store/bookings';

function DeleteBookingModal({ booking, isOpen, onClose }) {
    const dispatch = useDispatch();
    const bookingId = booking.booking.id;
    console.log('booking: ', booking.booking)
    const handleDeleteBooking = async () => {
        try {
            await dispatch(bookingActions.deleteBookingThunk(bookingId));
            onClose();
            await dispatch(bookingActions.getUserBookingsThunk(booking.userId));
        } catch (error) {
            console.error("Error deleting booking:", error);
        }
    };

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
