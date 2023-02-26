const express = require('express')
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, Sequelize, ReviewImage, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Op } = require('sequelize')
const router = express.Router();
let schema;
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
// [ Sequelize.literal(`(SELECT ROUND(AVG(stars), 1) FROM ${schema ? `"${schema}"."Reviews"` : 'Reviews'}
// WHERE "Reviews"."spotId" = "Spot"."id")`),'avgRating'],
// [ Sequelize.literal(`(SELECT url FROM ${schema ? `"${schema}"."SpotImages"` : 'SpotImages'}
// WHERE "SpotImages"."spotId" = "Spot"."id" AND "SpotImages"."preview" = true LIMIT 1)`),'previewImage']],
router.get('/', async (req,res) => {
    const { page = 1, size = 20, minLat, maxLat, minLng, maxLng, minPrice = 0, maxPrice = 0 } = req.query;

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
    //.scope({ method: ['getAllSpotsQF'] })
    const spots = await Spot.scope('spotInfo').findAll({
        // attributes: ['id', 'ownerId', 'address', 'city',
        //     'state', 'country', 'lat', 'lng', 'name', 'description',
        //     'price', 'createdAt', 'updatedAt',
        //     [Sequelize.col('SpotImages.url'), 'preview']],
            include: [
                { model: Review },
                { model: SpotImage },
            ],
        //     group:['Spot.id', 'SpotImages.url'],
            where: filters,
            limit: limit,
            offset: offset,
        })
        // const spots = await Spot.findAll({
        //     attributes: ['id', 'ownerId', 'address', 'city',
        //     'state', 'country', 'lat', 'lng', 'name', 'description',
        //     'price', 'createdAt', 'updatedAt',
        //     // [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
        //     [Sequelize.col('SpotImages.url'), 'preview']],
        //     include: [
        //         { model: Review, as: 'Reviews', attributes: []},
        //         { model: SpotImage, attributes: []},
        //     ],
        //     group:['Spot.id', 'SpotImages.url'],
        //     where: filters,
        //     limit: limit,
        //     offset: offset,
        // })
        if (!spots || spots.length === 0) {
            return res.status(404).json({
                message: "Spots do not exist",
                statusCode: 404
            })
        }
        if (page <= 0) {
        return res.status(400).json({
            'message': 'Validation Error',
            "statusCode": 400,
            'errors': {
               'page': "Page must be greater than or equal to 1"
            }
        })
    } else if (size < 1) {
        return res.status(400).json({
            'message': 'Validation Error',
            "statusCode": 400,
            'errors': {
               'size': "Size must be greater than or equal to 1"
            }
        })
    } else if (minLat < -90) {
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

    // if (spots) {
    //     const allSpots = spots.map((spot) => {
    //         const {
    //             id,
    //             ownerId,
    //             address,
    //             city,
    //             state,
    //             country,
    //             lat,
    //             lng,
    //             name,
    //             description,
    //             price,
    //             createdAt,
    //             updatedAt
    //         } = spot;
    //         return {
    //             id,
    //             ownerId,
    //             address,
    //             city,
    //             state,
    //             country,
    //             lat,
    //             lng,
    //             name,
    //             description,
    //             price,
    //             createdAt,
    //             updatedAt,
    //             previewImage
    //         }
    //     })
    for ( let spot of spots ) {
        for ( let image of spot.SpotImages ) {
              if ( image.dataValues.preview ) {
                    spot.dataValues.previewImage = image.url;
              }
            //   if ( !spot.dataValues.previewImage) {
            //       spot.dataValues.previewImage = "No preview image";
            //   }
        delete spot.dataValues.SpotImages;
        };

        let average = 0;
        for ( let review of spot.Reviews ) {
              average += review.dataValues.stars;
        };
        average = average / spot.Reviews.length;
        spot.dataValues.avgRating = average;
        if ( !spot.dataValues.avgRating ) {
              spot.dataValues.avgRating = "No reviews yet"
        }
        delete spot.dataValues.Reviews;
  }
        return res.status(200).json({ Spots: spots, page, size })
    }
})

//get all spots by current user
router.get('/current', requireAuth, async (req,res) => {
    const userId = req.user.id
    const currSpots = await Spot.findAll({ where: { ownerId: userId },
            attributes: ['id', 'ownerId', 'address', 'city',
            'state', 'country', 'lat', 'lng', 'name', 'description',
            'price', 'createdAt', 'updatedAt',
            //[Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 2), 'avgRating'],
            [ Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
            [Sequelize.col('SpotImages.url'), 'previewImage']],
            include: [
                { model: Review, attributes: []},
                { model: SpotImage, attributes: []}
            ],
            group:['Spot.id', 'SpotImages.url']
        })
    if (currSpots) {
        return res.status(200).json({ "Spots": currSpots })
    } else {
        res.status(400).json({
            "message": 'Current user has no spots',
            'statusCode': 404
        })
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
    const spot = await Spot.findOne({
        where: { id },
        attributes: ['id', 'ownerId', 'address', 'city',
            'state', 'country', 'lat', 'lng', 'name', 'description',
            'price', 'createdAt', 'updatedAt',
            [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
            // [Sequelize.fn('ROUND', Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 2), 'avgRating'],
            [ Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
            ],
            include: [
                { model: Review, attributes: []},
                { model: SpotImage, attributes: ['id', 'url', 'preview']},
                { model: User, as: 'Owner', attributes: ['id','firstName','lastName']}
            ],
            group: ['Spot.id', 'SpotImages.id', 'SpotImages.url', 'SpotImages.preview', 'Owner.id', 'Owner.firstName', 'Owner.lastName']
    })
    if (spot.id) {
        res.status(200).json(spot)
    }
})
//create a spot
//confused if the usual middleware response is valid or do I need to make my own
router.post('/', restoreUser, requireAuth, async (req,res) => {
    const ownerId = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body

    if (!address || address === "") {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "address": "Street address is required"
            }
        })
    }

    if (!city || city === "") {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "city": "City is required"
            }
        })
    }

    if (!state || state === "") {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "state": "State is required"
            }
        })
    }

    if (!country || country === "") {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "country": "Country is required"
            }
        })
    }

    if (!lat || lat === "") {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "lat": "Latitude is not valid"
            }
        })
    }

    if (!lng || lng === "") {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "lng": "Longitude is not valid"
            }
        })
    }

    if (!name || name === "") {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "name": "Please enter a name for your spot"
            }
        })
    }

    if (name.length > 50) {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "name": "Name must be less than 50 characters"
            }
        })
    }

    if (!description || !description === "") {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "description": "Description is required"
            }
        })
    }

    if (!price || price === "") {
        return res.status(400).json({
            "message": "Validation Error",
            "statusCode": 400,
            "errors": {
                "price": "Price per day is required"
            }
        })
    }

    const newSpot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    if (newSpot) {
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
    } else {
        return res.status(403).json({ 'Message':'User is not authorized' })
    }
})

//edit a spot
router.put('/:spotId', requireAuth, validateSpots, async(req,res) => {
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

    } else { //if you are not the owner
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
