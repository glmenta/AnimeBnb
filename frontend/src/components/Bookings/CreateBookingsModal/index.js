import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as bookingActions from '../../../store/bookings';
import './createbooking.css';

function CreateBookingsModal({ spotId, isOpen, onClose }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state.session.user);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});
    const currentDate = new Date();

    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors = {};

        // Validate start date
        if (!startDate) {
            validationErrors.startDate = 'Start date is required';
        } else if (new Date(startDate) < currentDate) {
            validationErrors.startDate = 'Start date must be in the future';
        }

        // Validate end date
        if (!endDate) {
            validationErrors.endDate = 'End date is required';
        } else if (new Date(endDate) < currentDate) {
            validationErrors.endDate = 'End date must be in the future';
        } else if (new Date(startDate) > new Date(endDate)) {
            validationErrors.endDate = 'End date must be after start date';
        }

        setErrors(validationErrors);

        if (Object.keys(validationErrors).length === 0) {
            // Dispatch action to create booking
            const payload = {
                startDate,
                endDate
            };

            const createdBooking = await dispatch(bookingActions.createBookingThunk(payload, spotId));

            if (createdBooking.statusCode === 400) {
                console.error('Error creating booking:', createdBooking.message);
            } else {
                history.push(`/users/${user.id}/bookings`);
            }
        }
    }

    return (
        isOpen &&
        <div className="create-booking-modal" >
            <div className="create-booking-modal-container">
                <div className="create-booking-modal-content">
                <h3 className="create-booking-title">Create Booking</h3>
                    <form className="create-booking-form" onSubmit={handleSubmit}>
                        <div className="form-container">
                            <div className="form-group">
                                <label htmlFor="startDate">Start Date</label>
                                <input
                                    type="date"
                                    id="startDate"
                                    value={startDate}
                                    className='start-date-input'
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                                {errors.startDate && <p className="error-message">{errors.startDate}</p>}
                            </div>
                            <div className="form-group">
                                <label htmlFor="endDate">End Date</label>
                                <input
                                    type="date"
                                    id="endDate"
                                    className='end-date-input'
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                                {errors.endDate && <p className="error-message">{errors.endDate}</p>}
                            </div>
                        </div>
                        <div className='button-container'>
                            <button type="submit" className="submit-button">Create Booking</button>
                            <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default CreateBookingsModal;
