import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as bookingActions from '../../../store/bookings';
import './updatebooking.css';

function UpdateBookingModal({ selectedBooking, isOpen, onClose }) {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState([]);
    const currentDate = new Date();

    const bookingId = selectedBooking.booking.id;

    useEffect(() => {
        if (bookingId) {
            dispatch(bookingActions.getBookingByIdThunk(bookingId));
        }
    }, [dispatch, bookingId]);

    const booking = useSelector((state) => state.booking.bookingDetails);

    useEffect(() => {
        if (booking) {
            setStartDate(booking.startDate);
            setEndDate(booking.endDate);
        }
    }, [booking]);

    const handleUpdateBooking = async (e) => {
        e.preventDefault();
        let newErrors = {};

        if (!startDate) {
            newErrors.startDate = 'Start date is required';
        } else if (new Date(startDate) < currentDate) {
            newErrors.startDate = 'Start date must be in the future';
        }

        // Validate end date
        if (!endDate) {
            newErrors.endDate = 'End date is required';
        } else if (new Date(endDate) < currentDate) {
            newErrors.endDate = 'End date must be in the future';
        } else if (new Date(startDate) > new Date(endDate)) {
            newErrors.endDate = 'End date must be after start date';
        }

        if (selectedBooking.booking.startDate === startDate || selectedBooking.booking.endDate === endDate) {
            newErrors.existingBooking = 'You are already booked for this time range';
        }

        setErrors(newErrors);
        if (Object.keys(newErrors).length) return;

        const payload = {
            id: bookingId,
            startDate,
            endDate
        };
        const updatedBooking = await dispatch(bookingActions.updateBookingThunk(payload));
        if (updatedBooking) {
            onClose();
        } else {
            setErrors(updatedBooking)
        }
    };

    return (
        isOpen &&
        <div className='update-booking-modal'>
            <div className='update-booking-container'>
                <h3 className='update-booking-title'>Update Your Booking</h3>
                {errors.existingBooking && <p className='error-message'>{errors.existingBooking}</p>}
                <form onSubmit={handleUpdateBooking}>
                    <label className='update-booking-label'>Start Date</label>
                    <input
                        type='date'
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    {errors.startDate && <p className='error-message'>{errors.startDate}</p>}
                    <label className='update-booking-label'>End Date</label>
                    <input
                        type='date'
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    {errors.endDate && <p className='error-message'>{errors.endDate}</p>}
                    <div className='update-booking-buttons'>
                        <button type='submit' className='update-booking-button' disabled={!startDate || !endDate}>Update</button>
                        <button className='update-close-button' onClick={onClose}>Close</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateBookingModal;
