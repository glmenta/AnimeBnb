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
    const response = await csrfFetch(`/api/bookings/${bookingId}`)
    if (response.ok) {
        const booking = await response.json()
        dispatch(getBookingById(booking))
        return booking
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
            newState.bookingDetails = action.booking
            return newState
        default:
            return state
    }
}

export default bookingReducer
