import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink,useHistory } from 'react-router-dom';
import * as bookingActions from '../../../store/bookings';
import BookingDetailModal from '../BookingDetailModal';
import UpdateBookingModal from '../UpdateUserBookingModal';

function UserBookingsPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.session.user);
    const [selectedBooking, setSelectedBooking] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);

    const userBookings = useSelector(state => state.booking.currentUserBookings.Bookings);
    console.log('user: ', userBookings)
    useEffect(() => {
        if (user) {
            dispatch(bookingActions.getUserBookingsThunk(user.id))
        }

    }, [dispatch, user])

    const handleBookingClick = async (booking) => {
        try {
            const bookingDetails = await dispatch(bookingActions.getBookingByIdThunk(booking.id));
            console.log('bookingDetails: ', bookingDetails)
            setSelectedBooking(bookingDetails);
            setShowDetailModal(true);
        } catch (error) {
            console.error("Error fetching booking:", error);
        }
    };

    const handleUpdateBooking = async (bookingId) => {
        console.log('bookingId in handleUpdateBooking: ', bookingId)
        try {
            const bookingDetails = await dispatch(bookingActions.getBookingByIdThunk(bookingId));
            setSelectedBooking(bookingDetails);
            setShowUpdateModal(true);
        } catch (error) {
            console.error("Error fetching booking:", error);
        }
    };

    return (
        <div>
            <h1>Bookings</h1>
            <div>
            {userBookings && userBookings.length > 0 ? (
                userBookings.map((booking) => (
                    <div key={booking.id}>
                        {/* <p>{booking.id}</p> */}
                        <h3>{booking.Spot.name}</h3>
                        <p>Start: {booking.startDate}</p>
                        <p>End: {booking.endDate}</p>
                        <button onClick={() => handleBookingClick(booking)}>View Details</button>
                        <button onClick={() => handleUpdateBooking(booking.id)}>Edit Booking</button>
                        <button onClick={() => history.push(`/bookings/${booking.id}/delete`)}>Delete Booking</button>
                    </div>
                ))
            ) : (
                <div>
                    <p>No Bookings Yet!</p>
                    <NavLink to='/'>Explore Spots</NavLink>
                </div>
            )}
        </div>
            <div>
                {showDetailModal && <BookingDetailModal selectedBooking={selectedBooking} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)}/>}
                {showUpdateModal && <UpdateBookingModal selectedBooking={selectedBooking} isOpen={showUpdateModal} onClose={() => setShowUpdateModal(false)}/>}
            </div>
        </div>
    )
}

export default UserBookingsPage
