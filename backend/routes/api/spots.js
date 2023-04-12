const express = require('express')
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, Sequelize, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')
const router = express.Router();

const validateSpots = [
    check('address')
        .exists({ checkFalsy: true})
        .notEmpty()
        .withMessage('Street Address is required'),
    check('city')
        .exists({ checkFalsy: true})
        .notEmpty()
        .withMessage("City is required"),
    check('state')
        .exists({ checkFalsy: true})
        .notEmpty()
        .withMessage("State is required"),
    check('country')
        .exists({ checkFalsy: true})
        .notEmpty()
        .withMessage("Country is required"),
    check('lat')
        .exists({ checkFalsy: true})
        .notEmpty()
        .isFloat({ min: -90, max: 90})
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true})
        .notEmpty()
        .isFloat({ min: -180, max: 180})
        .withMessage("Longitude is not valid"),
    check('name')
        .exists({ checkFalsy: true})
        .notEmpty()
        .isLength({ max: 49 })
        .withMessage("Name must be less than 50 characters"),
    check('description')
        .exists({ checkFalsy: true})
        .notEmpty()
        .withMessage("Description is required"),
    check('price')
        .exists({ checkFalsy: true})
        .notEmpty()
        .withMessage("Price per day is required"),
    handleValidationErrors
]

const validateReview = [
    check('review')
        .exists({ checkFalsy: true})
        .notEmpty()
        .withMessage("Review text is required"),
    check('stars')
        .exists({ checkFalsy: true})
        .notEmpty()
        .isInt({ min: 1, max: 5})
        .withMessage("Stars must be an integer from 1 to 5"),
    handleValidationErrors
]

//get all spots
router.get('/', async (req,res) => {
    let { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice = 0, maxPrice = 0 } = req.query;

    const limit = Math.min(parseInt(size), 20);
    const offset = (parseInt(page) - 1) * limit;
    const filters = {
        ...(minLat && { lat: { [Op.gte]: minLat } }),
        ...(maxLat && { lat: { [Op.lte]: maxLat } }),
        ...(minLng && { lng: { [Op.gte]: minLng } }),
        ...(maxLng && { lng: { [Op.lte]: maxLng } }),
        ...(minPrice && { price: { [Op.gte]: minPrice } }),
        ...(maxPrice && { price: { [Op.lte]: maxPrice } })
    };

    if (page <= 0) {
        return res.status(400).json({
            'message': 'Validation Error',
            "statusCode": 400,
            'errors': {
               'page': "Page must be greater than or equal to 1"
            }
        })
    } if (size < 1) {
            return res.status(400).json({
                'message': 'Validation Error',
                "statusCode": 400,
                'errors': {
                   'size': "Size must be greater than or equal to 1"
                }
            })

    }
    const spots = await Spot.scope('spotInfo').findAll({
        include: [
            { model: Review },
            { model: SpotImage },
        ],
        where: filters,
        limit: limit,
        offset: offset,
    })

    if (!spots || spots.length === 0) {
        return res.status(404).json({
            message: "Spots do not exist",
            statusCode: 404
        })
    }
    if (minLat < -90) {
        return res.status(400).json({
            'message': 'Validation Error',
            "statusCode": 400,
            'errors': {
                'minLat': "Minimum latitude is invalid"
            }
        })
    } else if (maxLat > 90) {
        return res.status(400).json({
            'message': 'Validation Error',
            "statusCode": 400,
            'errors': {
                'maxLat': "Maximum latitude is invalid"
            }
        })
    } else if (minLng < -180 ) {
        return res.status(400).json({
            'message': 'Validation Error',
            "statusCode": 400,
            'errors': {
                'minLng': "Minimum longitude is invalid"
            }
        })
    } else if (maxLng > 180) {
        return res.status(400).json({
            'message': 'Validation Error',
            "statusCode": 400,
            'errors': {
                'maxLng': "Maximum longitude is invalid"
            }
        })
    } else if (minPrice && minPrice <= 0) {
        return res.status(400).json({
            'message': 'Validation Error',
            "statusCode": 400,
            'errors': {
               'minPrice': "Minimum price must be greater than or equal to 1"
            }
        })
    } else if (maxPrice && maxPrice <= 0) {
        return res.status(400).json({
            'message': 'Validation Error',
            "statusCode": 400,
            'errors': {
               'maxPrice': "Maximum price must be greater than or equal to 1"
            }
        })
    } else {
        if (spots.length === 0) {
            return res.status(404).json({
                'message':  "There are no spots within given parameters",
                'statusCode': 404
            })
        }

    for (let spot of spots) {
        const images = spot.SpotImages;
        let previewImage = 'No images';
        let avgRating = 'No reviews';
        let totalStars = 0;

        for (let image of images) {
          if (image.dataValues.preview) {
            previewImage = image.url;
            break;
          }
        }

        if (images.length > 0) {
          let reviews = spot.Reviews || [];
          let numReviews = reviews.length;

          if (numReviews > 0) {
            for (let review of reviews) {
              totalStars += review.dataValues.stars;
            }
            avgRating = totalStars / numReviews;
          }
        }

        spot.dataValues.previewImage = previewImage;
        spot.dataValues.avgRating = avgRating;
        delete spot.dataValues.SpotImages;
        delete spot.dataValues.Reviews;
      }

    if(spots) {
            const allSpots = spots.map(spot => {
                spot = spot.toJSON()
                const lat = parseFloat(spot.lat)
                const lng = parseFloat(spot.lng)
                const price = parseFloat(spot.price)
                const avgRating = parseFloat(spot.avgRating)
                return {
                    id: spot.id,
                    ownerId: spot.ownerId,
                    address: spot.address,
                    city: spot.city,
                    state: spot.state,
                    country: spot.country,
                    lat,
                    lng,
                    name: spot.name,
                    description: spot.description,
                    price,
                    createdAt: spot.createdAt,
                    updatedAt: spot.updatedAt,
                    avgRating,
                    previewImage: spot.previewImage
                }
            })
            page = parseFloat(page)
            size = parseFloat(size)
            return res.status(200).json({ Spots: allSpots, page, size })
        }
    }
})

//get all spots by current user
router.get('/current', requireAuth, async (req,res) => {
    const userId = req.user.id
    const currSpots = await Spot.findAll({
        where: { ownerId: userId },
        })

    if (currSpots) {
        const allSpots = currSpots.map(spot => {
            spot = spot.toJSON()
            const lat = parseFloat(spot.lat)
            const lng = parseFloat(spot.lng)
            const price = parseFloat(spot.price)
            const avgRating = parseFloat(spot.avgRating)
            return {
                id: spot.id,
                ownerId: spot.ownerId,
                address: spot.address,
                city: spot.city,
                state: spot.state,
                country: spot.country,
                lat,
                lng,
                name: spot.name,
                description: spot.description,
                price,
                createdAt: spot.createdAt,
                updatedAt: spot.updatedAt,
                avgRating,
                previewImage: spot.previewImage
            }
        })
        return res.status(200).json({ "Spots": allSpots })
    } else {
        res.status(400).json({
            "message": 'Current user has no spots',
            'statusCode': 404
        })
    }
})

//edit a spot
router.put('/:spotId/edit', requireAuth, validateSpots, async(req,res) => {
    const id = req.params.spotId
    const userId = req.user.id
    const spot = await Spot.findByPk(id)
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    if (!spot || spot.id === null) {
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }

    if (userId === spot.ownerId) {
        await spot.update({
            address, city, state, country, lat, lng, name, description, price
        })
        return res.status(200).json(spot)
    } else {
        return res.status(403).json({ 'Message':'User is not authorized' })
    }
})

//get details of a spot by spotId
router.get('/:spotId', async (req,res) => {
    const id = req.params.spotId
    const checkIfExists = await Spot.findByPk(id)

    if (!checkIfExists) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    let spot = await Spot.scope(['defaultScope','spotDetails']).findOne({
        where: { id },
        group: ['Spot.id', 'SpotImages.id', 'SpotImages.url', 'SpotImages.preview', 'Owner.id', 'Owner.firstName', 'Owner.lastName']
    })

    if (spot) {
            //console.log('this is spot from backend', spot)
            spot = spot.toJSON()
            spot.lat = parseFloat(spot.lat)
            spot.lng = parseFloat(spot.lng)
            spot.price = parseFloat(spot.price)
            spot.avgRating = parseFloat(spot.avgRating)
        }
    return res.status(200).json(spot)
})
// router.get('/:spotId', async (req, res) => {
//     const id = req.params.spotId;
//     const checkIfExists = await Spot.findByPk(id);
//     if (!checkIfExists) {
//         res.status(404).json({
//             "message": "Spot couldn't be found",
//             "statusCode": 404
//         });
//     }
//     let spot = await Spot.findOne({
//         where: { id },
//         include: [{ model: SpotImage }],
//         group: ['Spot.id', 'SpotImages.id', 'SpotImages.url', 'SpotImages.preview', 'Owner.id', 'Owner.firstName', 'Owner.lastName']
//     });
//     if (spot) {
//         spot = spot.toJSON();
//         spot.lat = parseFloat(spot.lat);
//         spot.lng = parseFloat(spot.lng);
//         spot.price = parseFloat(spot.price);
//         spot.avgRating = parseFloat(spot.avgRating);
//     }
//     return res.status(200).json(spot);
// });
//create a spot
//need to change this to /:spotId/new
router.post('/', restoreUser, requireAuth, validateSpots, async (req,res) => {
    const ownerId = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    let newSpot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
        //previewImage
    })

    if (newSpot) {
        newSpot = newSpot.toJSON()
        newSpot.lat = parseFloat(newSpot.lat)
        newSpot.lng = parseFloat(newSpot.lng)
        newSpot.price = parseFloat(newSpot.price)
        return res.status(201).json(newSpot)
    }
})

//Add img to spot based on spotId
router.post('/:spotId/images', restoreUser, requireAuth, async (req,res) => {
    const id = req.params.spotId
    const userId = req.user.id
    const { url, preview } = req.body

    const spot = await Spot.findOne({where: { id }});

    if (!spot) {
        return res.status(404).json({ "message": "Spot couldn't be found", "statusCode": 404 })
    }

    if (userId === spot.ownerId) {
        const newImage = await SpotImage.create({
        spotId: id,
        url,
        preview
        }, {
            attributes: { exclude: ['spotId', 'createdAt', 'updatedAt']}
        });

    const spotImg = await SpotImage.findByPk(newImage.id)

    if (spotImg) {
        return res.status(200).json(spotImg)
    }

    return res.status(403).json({ 'Message':'User is not authorized' })
    }
})

//delete a spot
router.delete('/:spotId', restoreUser, requireAuth, async(req,res) => {
    const id = req.params.spotId
    const userId = req.user.id
    const spot = await Spot.findByPk(id)

    if (!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    if (userId === spot.ownerId) {
        await spot.destroy()
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    } else {
        return res.status(403).json({ 'Message':'User is not authorized' })
    }
})

//get all reviews by spot id
router.get('/:spotId/reviews', async(req,res) => {
    const id = req.params.spotId
    const spot = await Spot.findByPk(id)

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    } else {
        const reviews = await Review.findAll({ where: { spotId: id },
            attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
                include: [
                    { model: User, attributes: ['id', 'firstName', 'lastName']},
                    { model: ReviewImage, attributes: ['id', 'url']},
                ]
        })
        return res.status(200).json({'Reviews': reviews })
    }
})

//create review for spot based on spot id
router.post('/:spotId/reviews', restoreUser, requireAuth, validateReview, async(req,res) => {
    const userId = req.user.id
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)
    const { review, stars } = req.body
    const existingReview = await Review.findOne({ where: { userId, spotId }})
    if (existingReview) {
        return res.status(403).json({
            "message": "User already has a review for this spot",
            "statusCode": 403
          })
    }
    if (spot) {
        const newReview = await Review.create({
            userId,
            spotId: parseInt(spotId),
            review,
            stars
        })
        if (newReview) {
            return res.status(201).json(newReview)
        }
    } else {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
          })
    }
})



//get all bookings of spot by spotid
router.get('/:spotId/bookings', restoreUser, requireAuth, async(req,res) => {
    const spotId = req.params.spotId
    const userId = req.user.id
    const spot = await Spot.findByPk(spotId)
    const bookings = await Booking.findAll({ where: { spotId }})
    const ownedSpotBookings = await Booking.findAll({ where: { spotId },
    include: [
        { model: User, attributes: ['id', 'firstName', 'lastName']}
    ],
    attributes: ['id', 'spotId', 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
    })
    if (!spot || bookings.length < 1) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    //if you are the owner
    if (userId === spot.ownerId) {
        const ownerBookings = ownedSpotBookings.map((booking) => {
            const { id, spotId, userId, startDate, endDate, createdAt, updatedAt, User } = booking
            return {
                User: {
                    id: User.id,
                    firstName: User.firstName,
                    lastName: User.lastName
                },
                id,
                spotId,
                userId,
                startDate,
                endDate,
                createdAt,
                updatedAt
            }
        })
        return res.status(200).json({ 'Bookings': ownerBookings })
    //if you are not the owner
    } else {
        const notOwnedBookings = bookings.map((booking) => {
            const { spotId, startDate, endDate } = booking
            return {
                spotId,
                startDate,
                endDate
            }
        })
        return res.status(200).json({'Bookings': notOwnedBookings })
    }
})

//create booking based on spotid
router.post('/:spotId/bookings', restoreUser, requireAuth, async(req,res) => {
    const userId = req.user.id
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)

    const { startDate, endDate } = req.body;

    if(!spot) {
        res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404

        })
    }

    if(spot.ownerId === userId) {
        res.status(403).json({
            message: "Cannot book on owned spot",
            statusCode: 403
        })
    }

    const invalidBookings = await Booking.findAll({
        where: {
            spotId,
            [Op.or]: [
                {
                    startDate: { [Op.lte]: startDate },
                    endDate: { [Op.gte]: startDate },
                },
                {
                    startDate: { [Op.lte]: endDate },
                    endDate: { [Op.gte]: endDate },
                },
                {
                    startDate: { [Op.gte]: startDate },
                    endDate: { [Op.lte]: endDate },
                },
            ]
        }
    })

    if (invalidBookings.length) {
        return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "statusCode": 403,
            "errors": {
              "startDate": "Start date conflicts with an existing booking",
              "endDate": "End date conflicts with an existing booking"
            }
        })
    }

    const newBooking = await Booking.create({
        spotId: parseInt(spotId),
        userId,
        startDate,
        endDate
    })

    if(newBooking) {
        return res.status(200).json({
            id: newBooking.id,
            spotId: newBooking.spotId,
            userId: newBooking.userId,
            startDate: newBooking.startDate,
            endDate: newBooking.endDate,
            createdAt: newBooking.createdAt,
            updatedAt: newBooking.updatedAt,
        })
    }

})
module.exports = router;
