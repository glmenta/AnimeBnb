import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as bookingActions from '../../../store/bookings';

function CreateBookingsModal({ spotId }) {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector((state) => state.session.user);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();

        let validationErrors = {};

        // Validate start date
        if (!startDate) {
            validationErrors.startDate = 'Start date is required';
        }

        // Validate end date
        if (!endDate) {
            validationErrors.endDate = 'End date is required';
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
        <div className="create-booking-modal">
            <h3>Create Booking</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label htmlFor="startDate">Start Date</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    {errors.startDate && <p className="error-message">{errors.startDate}</p>}
                </div>
                <div className="form-group">
                    <label htmlFor="endDate">End Date</label>
                    <input
                        type="date"
                        id="endDate"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                    {errors.endDate && <p className="error-message">{errors.endDate}</p>}
                </div>
                <button type="submit" className="submit-button">Create Booking</button>
            </form>
        </div>
    );
}

export default CreateBookingsModal;
