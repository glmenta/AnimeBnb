import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as bookingActions from '../../../store/bookings';
function UserBookingsPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.session.user);
    const [bookings, setBookings] = useState([]);
    const userBookings = useSelector(state => state.booking.currentUserBookings.Bookings);
    console.log('user: ', userBookings)
    useEffect(() => {
        if (user) {
            dispatch(bookingActions.getUserBookingsThunk(user.id))
        }
    }, [dispatch, user])

    return (
        <div>
            <h1>User Bookings Page</h1>
            <div>
                {userBookings && userBookings.map((booking) => (
                    <div key={booking.id}>
                        {/* <p>{booking.id}</p> */}
                        <h3>{booking.Spot.name}</h3>
                        <p>Start: {booking.startDate}</p>
                        <p>End: {booking.endDate}</p>
                        <button onClick={() => history.push(`/bookings/${booking.id}`)}>View Details</button>
                        <button onClick={() => history.push(`/bookings/${booking.id}/edit`)}>Edit Booking</button>
                        <button onClick={() => history.push(`/bookings/${booking.id}/delete`)}>Delete Booking</button>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default UserBookingsPage
