import React from 'react';
import { useHistory } from 'react-router-dom';
import * as bookingActions from '../../../store/bookings';
import './bookingdetail.css'
function BookingDetailModal({selectedBooking, isOpen, onClose}) {
    const history = useHistory();
    const booking = selectedBooking.booking
    const navigateToSpot = () => {
        history.push(`/spots/${booking.Spot.id}`);
        onClose()
    }
    return (
        isOpen &&
        <div className='booking-detail-modal'>
            <div className='booking-detail-container'>
                <h3 className='booking-spot-name' onClick={navigateToSpot}>{booking.Spot.name}</h3>
                <h3 className='booking-descriptiopn'>{booking.Spot.description}</h3>
                <img className='booking-spot-img' src={booking.Spot.SpotImages[0]?.url || null}/>
                <p className='booking-address'>{booking.Spot.address}</p>
                <p className='booking-location'>{booking.Spot.state}, {booking.Spot.city}</p>
                <p className='booking-country'>{booking.Spot.country}</p>
                <p className='booking-price'>Price: ${booking.Spot.price} per night</p>
                <button className='close-booking-button' onClick={onClose}>Close</button>
            </div>
        </div>
    )
}

export default BookingDetailModal
