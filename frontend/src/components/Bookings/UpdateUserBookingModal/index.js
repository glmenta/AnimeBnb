import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as bookingActions from '../../../store/bookings';

function UpdateBookingModal({ selectedBooking, isOpen, onClose }) {
    const dispatch = useDispatch();
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState([]);
    const history = useHistory();
    const currentDate = new Date()

    const bookingId = selectedBooking.booking.id;

    useEffect(() => {
        if (bookingId) {
            dispatch(bookingActions.getBookingByIdThunk(bookingId));
        }
    }, [dispatch, bookingId]);

    // Retrieve booking details from the store
    const booking = useSelector((state) => state.booking.bookingDetails);
    const user = useSelector((state) => state.session.user);

    // Update component state with booking details
    useEffect(() => {
        if (booking) {
            setStartDate(booking.startDate);
            setEndDate(booking.endDate);
        }
    }, [booking]);

    const handleUpdateBooking = async (e) => {
        e.preventDefault();
        let errors = {};

        if (startDate > endDate) {
            errors.startDate = 'Start date must be before end date';
        }
        if (endDate < startDate) {
            errors.endDate = 'End date must be after start date';
        }

        if (new Date(endDate) < currentDate) {
            errors.endDate = 'End date must be in the future';
        }

        setErrors(errors);
        if (Object.keys(errors).length) return;

        const payload = {
            id: bookingId,
            startDate,
            endDate
        };
        console.log('this is payload', payload)
        const updatedBooking = await dispatch(bookingActions.updateBookingThunk(payload));
        if (updatedBooking) {
            onClose();
            history.push(`/users/${user.id}/bookings`);
        } else {
            setErrors(updatedBooking)
        }
    }

    return (
        isOpen &&
        <div className='update-booking-modal'>
            <h3>Update Your Booking</h3>
            <form onSubmit={handleUpdateBooking}>
                <label>Start Date</label>
                <input
                    type='date'
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                />
                {errors.startDate && <p className='error-message'>{errors.startDate}</p>}
                <label>End Date</label>
                <input
                    type='date'
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                />
                {errors.endDate && <p className='error-message'>{errors.endDate}</p>}
                <button type='submit' className='update-booking-button'>Update</button>
            </form>
            <button onClick={onClose}>Close</button>
        </div>
    )
}

export default UpdateBookingModal;