import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as bookingActions from '../../../store/bookings';
import './deletebooking.css';
function DeleteBookingModal({ booking, isOpen, onClose }) {
    const dispatch = useDispatch();
    const bookingId = booking.booking.id;

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
        // isOpen &&
        <div className='delete-booking-modal'>
            <div className='delete-booking-modal-container'>
                <p className='delete-booking-prompt'>Are you sure you want to delete this booking?</p>
                <button className='delete-booking-button' onClick={handleDeleteBooking}>Yes (Delete Booking)</button>
                <button className='keep-booking-button' onClick={onClose}>No (Keep Booking)</button>
            </div>
        </div>
    )
}

export default DeleteBookingModal
