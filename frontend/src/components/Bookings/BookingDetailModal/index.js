import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as bookingActions from '../../../store/bookings';

function BookingDetailModal({selectedBooking, isOpen, onClose}) {
    const dispatch = useDispatch();
    const history = useHistory();
    console.log('selectedBooking', selectedBooking)
    const booking = selectedBooking.booking
    const navigateToSpot = () => {
        history.push(`/spots/${booking.Spot.id}`);
        onClose()
    }
    return (
        isOpen &&
        <div className='booking-detail-modal'>
            <h3 onClick={navigateToSpot}>{booking.Spot.name}</h3>
            <img className='booking-spot-img' src={booking.Spot.previewImage || null}/>
            <p>{booking.Spot.avgRating}</p>
            <p>{booking.Spot.address}</p>
            <p>{booking.Spot.state}, {booking.Spot.city}</p>
            <p>{booking.Spot.country}</p>
            <p>Price: ${booking.Spot.price}</p>

            <button onClick={onClose}>Close</button>
        </div>
    )
}

export default BookingDetailModal
