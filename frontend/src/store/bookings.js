import { csrfFetch } from "./csrf";

const GET_BOOKINGS = 'bookings/getBookings';
const GET_BOOKING_BY_ID = 'bookings/getBookingById';
const CREATE_BOOKING = 'bookings/createBooking';
const UPDATE_BOOKING = 'bookings/updateBooking';
const DELETE_BOOKING = 'bookings/deleteBooking';
const GET_SPOT_BOOKINGS = 'bookings/getSpotBookings';

export const getBookings = (bookings) => {
    return {
        type: GET_BOOKINGS,
        bookings
    }
}

export const getBookingById = (bookingId) => {
    return {
        type: GET_BOOKING_BY_ID,
        bookingId
    }
}
export const getSpotBookings = (bookings) => {
    return {
        type: GET_SPOT_BOOKINGS,
        bookings
    }
}

export const createBooking = (booking) => {
    return {
        type: CREATE_BOOKING,
        booking
    }
}

export const updateBooking = (booking) => {
    return {
        type: UPDATE_BOOKING,
        booking
    }
}

export const deleteBooking = (booking) => {
    return {
        type: DELETE_BOOKING,
        booking
    }
}

export const getUserBookingsThunk = () => async dispatch => {
    const response = await csrfFetch(`/api/bookings/current`)
    if (response.ok) {
        const bookings = await response.json()
        console.log('bookings', bookings)
        dispatch(getBookings(bookings))
        return bookings
    } else {
        const error = await response.json()
        return error
    }
}

export const getBookingByIdThunk = (bookingId) => async dispatch => {
    console.log('this is bookingId', bookingId)
    const response = await csrfFetch(`/api/bookings/${bookingId}`, {
        method: 'GET',
        headers: {'Content-Type': 'application/json'},
    })
    if (response.ok) {
        const booking = await response.json()
        console.log('this is booking', booking)
        dispatch(getBookingById(booking))
        return booking
    } else {
        const error = await response.json()
        return error
    }
}

export const updateBookingThunk = (booking) => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${booking.id}/edit`, {
        method: 'PUT',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(booking)
    })
    if (response.ok) {
        const updatedBooking = await response.json()
        dispatch(updateBooking(updatedBooking))
        return updatedBooking
    } else {
        const error = await response.json()
        return error
    }
}

export const createBookingThunk = (booking, spotId) => async dispatch => {
    console.log('booking in createBookingThunk: ', booking)
    const response = await csrfFetch(`/api/spots/${spotId}/bookings`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(booking)
    })
    if (response.ok) {
        const newBooking = await response.json()
        dispatch(createBooking(newBooking))
        return newBooking
    } else {
        const error = await response.json()
        return error
    }
}

export const deleteBookingThunk = (bookingId) => async dispatch => {
    const response = await csrfFetch(`/api/bookings/${bookingId}/delete`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
    })
    if (response.ok) {
        const deletedBooking = await response.json()
        dispatch(deleteBooking(deletedBooking))
        return deletedBooking
    } else {
        const error = await response.json()
        return error
    }
}
const initialState ={
    currentUserBookings: [],
    bookingDetails: {}
}

const bookingReducer = (state = initialState, action) => {
    let newState = { ...state }
    switch (action.type) {
        case GET_BOOKINGS:
            newState.currentUserBookings = action.bookings
            return newState
        case GET_BOOKING_BY_ID:
            newState.bookingDetails = action.bookingId
            return newState
        case UPDATE_BOOKING:
            newState.bookingDetails = action.booking
            return newState
        case CREATE_BOOKING:
            newState.currentUserBookings[action.booking.id] = action.booking
            return newState
        case DELETE_BOOKING:
            delete newState.currentUserBookings[action.booking.id]
            return newState
        default:
            return state
    }
}

export default bookingReducer
