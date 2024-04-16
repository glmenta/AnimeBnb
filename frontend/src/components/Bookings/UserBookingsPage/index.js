import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useHistory } from 'react-router-dom';
import * as bookingActions from '../../../store/bookings';
import BookingDetailModal from '../BookingDetailModal';
import UpdateBookingModal from '../UpdateUserBookingModal';
import DeleteBookingModal from '../DeleteBookingModal';
import './UserBookings.css';

function UserBookingsPage() {
    const dispatch = useDispatch();
    const history = useHistory();
    const user = useSelector(state => state.session.user);
    const [selectedBooking, setSelectedBooking] = useState([]);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteErrorMessage, setDeleteErrorMessage] = useState('');

    const userBookings = useSelector(state => state.booking.currentUserBookings.Bookings);

    useEffect(() => {
        if (user) {
            dispatch(bookingActions.getUserBookingsThunk());
        }
    }, [dispatch, user]);

    const handleBookingClick = async (booking) => {
        try {
            const bookingDetails = await dispatch(bookingActions.getBookingByIdThunk(booking.id));
            setSelectedBooking(bookingDetails);
            setShowDetailModal(true);
        } catch (error) {
            console.error("Error fetching booking:", error);
        }
    };

    const handleUpdateBooking = async (bookingId) => {
        try {
            const bookingDetails = await dispatch(bookingActions.getBookingByIdThunk(bookingId));
            setSelectedBooking(bookingDetails);
            setShowUpdateModal(true);
        } catch (error) {
            console.error("Error fetching booking:", error);
        }
    };

    const handleCloseUpdateModal = () => {
        dispatch(bookingActions.getUserBookingsThunk());
        setShowUpdateModal(false);
    };

    const handleCloseDeleteModal = () => {
        dispatch(bookingActions.getUserBookingsThunk())
            .then(() => {
                setShowDeleteModal(false);
                setDeleteErrorMessage('');
            })
            .catch(error => console.error('Failed to refresh bookings:', error));
    };

    const refreshBookings = () => {
        if (user) {
            dispatch(bookingActions.getUserBookingsThunk())
                .catch(error => console.error('Failed to refresh bookings:', error));
        }
    };

    const handleDeleteBooking = async (bookingId, bookingStartDate, bookingEndDate) => {
        try {
            if (isBookingLive(bookingStartDate, bookingEndDate)) {
                setDeleteErrorMessage('You cannot delete a booking that is currently live.');
            } else if (isBookingOver(bookingEndDate)) {
                setDeleteErrorMessage('This booking is over.');
            } else {
                const bookingDetails = await dispatch(bookingActions.getBookingByIdThunk(bookingId));
                setSelectedBooking(bookingDetails);
                setShowDeleteModal(true);
            }
        } catch (error) {
            console.error("Error fetching booking:", error);
        }
    };

    const isBookingLive = (startDate, endDate) => {
        const today = new Date();
        const bookingStartDate = new Date(startDate);
        const bookingEndDate = new Date(endDate);

        bookingEndDate.setDate(bookingEndDate.getDate() + 1);
        return today >= bookingStartDate && today <= bookingEndDate;
    };

    const isBookingOver = (endDate) => {
        const today = new Date();
        const bookingEndDate = new Date(endDate);
        bookingEndDate.setDate(bookingEndDate.getDate() + 1);
        return today > bookingEndDate;
    };

    const viewSpot = (spotId) => {
        history.push(`/spots/${spotId}`);
    }

    return (
        <div className='user-bookings-page'>
            <div className='user-bookings-container'>
                <h1 className='user-bookings-title'>Current Bookings</h1>
                <div>
                    {userBookings && userBookings.length > 0 ? (
                        userBookings.map((booking) => (
                            <div key={booking.id} className='booking-card' >
                                <div className='booking-details' onClick={() => viewSpot(booking.Spot.id)}>
                                    <h3>{booking.Spot.name}</h3>
                                    {isBookingLive(booking.startDate, booking.endDate) && <p className='booking-live'>This booking is currently live!</p>}
                                    {isBookingOver(booking.endDate) && <p className='booking-over'>This booking is over.</p>}
                                    <img className='booking-spot-img' src={booking.Spot.previewImage || null} />
                                    <p className='booking-date'>{booking.startDate} to {booking.endDate}</p>
                                </div>

                                <div className='booking-buttons'>
                                <button onClick={() => handleBookingClick(booking)}>View Details</button>
                                <button onClick={() => handleUpdateBooking(booking.id, booking.startDate, booking.endDate)} disabled={isBookingLive(booking.startDate, booking.endDate) || isBookingOver(booking.endDate)}>Edit Booking</button>
                                <button onClick={() => handleDeleteBooking(booking.id, booking.startDate, booking.endDate)} disabled={isBookingLive(booking.startDate, booking.endDate) || isBookingOver(booking.endDate)}>Delete Booking</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className='no-bookings-container'>
                            <p>No Bookings Yet!</p>
                            <NavLink to='/'>Explore Spots</NavLink>
                        </div>
                    )}
                </div>
                <div className='user-bookings-modal-container'>
                    {deleteErrorMessage && <p>{deleteErrorMessage}</p>}
                    {showDetailModal && <BookingDetailModal selectedBooking={selectedBooking} isOpen={showDetailModal} onClose={() => setShowDetailModal(false)} />}
                    {showUpdateModal && <UpdateBookingModal selectedBooking={selectedBooking} isOpen={showUpdateModal} onClose={() => handleCloseUpdateModal()} />}
                    {deleteErrorMessage.length === 0 && showDeleteModal && <DeleteBookingModal refreshBookings={refreshBookings} booking={selectedBooking} isOpen={showDeleteModal} onClose={() => handleCloseDeleteModal()} />}
                </div>
            </div>
        </div>
    );
}

export default UserBookingsPage;
