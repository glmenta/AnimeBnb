const express = require('express')
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Sequelize, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')
const router = express.Router();

const validateBooking = [
    check('startDate')
        .exists({ checkFalsy: true})
        .isDate()
        .withMessage(),
    check('endDate')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isDate()
        .custom((endDate, { req }) => {
            const startDate = req.body.startDate
            if (endDate && startDate) {
                if (new Date(startDate) >= new Date (endDate)) {
                    throw new Error ('endDate cannot be on or before startDate')
                }
            }
            return true
        })
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
                    {
                        model: SpotImage, attributes: ['url'],
                        where: { preview: true }
                    }
                ]},
                ],
            attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
            group: ['Booking.id']
        });
        if (currentBookings) {
            const bookings = currentBookings.map((booking) => {
                const { id, spotId, userId, startDate, endDate, createdAt, updatedAt, Spot } = booking

                let previewImage;

                if (Spot.SpotImages.length > 0) {
                    previewImage = Spot.SpotImages[0].url
                } else {
                    previewImage = null;
                }

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
                        price: Spot.price,
                        previewImage
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
    const { startDate, endDate } = req.body

    const checkBooking = await Booking.findByPk(bookingId)

    if (!checkBooking) {
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }

    if (checkBooking.userId !== userId) {
        return res.status(403).json({
            "message": "User not authorized",
            "statusCode": 403
        })
    }

    if (new Date(endDate) <= new Date (startDate)) {
        return res.status(400).json({
            message: "endDate cannot come before startDate",
            statusCode: 400
        })
    }

    const alreadyBooked = await Booking.findOne({
        where: {
            spotId: checkBooking.spotId,
            endDate: {
                [Op.gte]: new Date (startDate)
            },
            startDate: {
                [Op.lte]: new Date (endDate)
            },
            id: {
                [Op.not]: checkBooking.id
            }
        }
    });

    if (alreadyBooked) {
        return res.status(403).json(
            {
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            }

        )
    }
    const checkDate = new Date();
    const lastDayOfBooking = new Date(checkBooking.endDate)

    if (lastDayOfBooking < checkDate) {
        return res.status(400).json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
    } else if (checkDate.startDate === checkBooking.endDate) {
        return res.status(400).json({
            message: "Cannot book and end on the same date",
            statusCode: 400
        })
    }

    const editBooking = await checkBooking.update({
        startDate: new Date (startDate),
        endDate: new Date (endDate)
    })
    return res.status(200).json(editBooking)
})

//delete booking
router.delete('/:bookingId', requireAuth, async (req,res) => {
    const bookingId = req.params.bookingId
    const userId = req.user.id

    const findBooking = await Booking.findByPk(bookingId, {
        include: Spot
    })

    if (!findBooking) {
        res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
          })
    }

    const checkDate = new Date();
    const firstDayOfBooking = new Date(findBooking.startDate)

    if (firstDayOfBooking <= checkDate) {
        return res.status(403).json({
            "message": "Bookings that have been started can't be deleted",
            "statusCode": 403
        })
    }

    if(findBooking.userId !== userId && findBooking.Spot.ownerId !== userId) {
        return res.status(403).json({
            message: "User not authorized",
            statusCode: 403
        })
    }

    await findBooking.destroy();

    res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
      })
})


module.exports = router;
