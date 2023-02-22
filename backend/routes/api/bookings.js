const express = require('express')
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Sequelize, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

const validateBooking = [
    check('endDate')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isDate()
        .isAfter()
        .withMessage('endDate cannot come before StartDate'),
    handleValidationErrors
]

//get all current bookings
router.get('/current', restoreUser, requireAuth, async(req,res) => {
    const userId = req.user.id
    const userBookings = await Booking.findByPk(userId)
    if (userBookings) {
        currentBookings = await Booking.findAll({ where:{ userId },
            include: [
                { model: Spot, attributes: ['id', 'ownerId', 'address', 'city',
                'state', 'country', 'lat', 'lng', 'name', 'description',
                'price', 'createdAt', 'updatedAt'],
                include: [
                    { model: SpotImage, attributes: ['url']}
                ]},
                ],
            attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
            group: ['Booking.id']
        });
        if (currentBookings) {
            const bookings = currentBookings.map((booking) => {
                const { id, spotId, userId, startDate, endDate, createdAt, updatedAt, Spot } = booking
                return {
                    id,
                    spotId,
                    Spot: {
                        id: Spot.id,
                        ownerId: Spot.ownerId,
                        address: Spot.address,
                        city: Spot.city,
                        state: Spot.state,
                        country: Spot.country,
                        lat: Spot.lat,
                        lng: Spot.lng,
                        name: Spot.name,
                        price: Spot.price
                    },
                    userId,
                    startDate,
                    endDate,
                    createdAt,
                    updatedAt
                }
            })
            return res.status(200).json({ 'Bookings': bookings })
        }
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }

})
//edit booking
router.put('/:bookingId', restoreUser, requireAuth, validateBooking, async (req,res) => {
    const bookingId = req.params.bookingId
    const userId = req.user.id
    //const spot = await Spot.findByPk()
    const checkBooking = await Booking.findByPk(bookingId)

    const { spotId, startDate, endDate } = req.body

    if (!checkBooking) {
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }

    if (userId === Booking.userId) {
        const editBooking = await Booking.update({
            startDate,
            endDate
        })
        return res.status(200).json(editBooking)
    } else {
        return res.status(403).json({
                "message": "User not authorized",
                "statusCode": 403
        })
    }
})
//delete booking

module.exports = router;
