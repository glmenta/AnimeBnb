const express = require('express')
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, Sequelize, ReviewImage } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { Session } = require('./session');
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
    const spots = await Spot.findAll({
        attributes: ['id', 'ownerId', 'address', 'city',
        'state', 'country', 'lat', 'lng', 'name', 'description',
        'price', 'createdAt', 'updatedAt',
        [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
        [Sequelize.col('SpotImages.url'), 'preview']],
        include: [
            { model: Review, attributes: []},
            { model: SpotImage, attributes: []},
        ],
        group:['Spot.id', 'SpotImages.url']
    })
    res.status(200).json({ "Spots": spots })
})

//get all spots by current user
router.get('/current', restoreUser, requireAuth, async (req,res) => {
    const userId = req.user.id
    const userSpots = await Spot.findByPk(userId);
    if (userSpots) {
        currSpots = await Spot.findAll({ where: { ownerId: userId },
            attributes: ['id', 'ownerId', 'address', 'city',
            'state', 'country', 'lat', 'lng', 'name', 'description',
            'price', 'createdAt', 'updatedAt',
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
            [Sequelize.col('SpotImages.url'), 'preview']],
            include: [
                { model: Review, attributes: []},
                { model: SpotImage, attributes: []}
            ],
            group:['Spot.id', 'Spotimages.url']
        })
        res.status(200)
        return res.json({ "Spots": currSpots })
    }
})

//get details of a spot by spotId
router.get('/:spotId', async (req,res) => {
    const id = req.params.spotId
    const spot = await Spot.findOne({
        where: { id },
        attributes: ['id', 'ownerId', 'address', 'city',
            'state', 'country', 'lat', 'lng', 'name', 'description',
            'price', 'createdAt', 'updatedAt',
            [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
            [Sequelize.col('SpotImages.url'), 'preview']],
            include: [
                { model: Review, attributes: []},
                { model: SpotImage, attributes: ['id', 'url', 'preview']},
                { model: User, as: 'Owner', attributes: ['id','firstName','lastName']}
            ]
    })
    if (spot.id) {
        res.status(200).json(spot)
    } else {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})
//create a spot
//confused if the usual middleware response is valid or do I need to make my own
router.post('/', restoreUser, requireAuth, async (req,res) => {
    const ownerId = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const requiredInputErrors = {
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {}
    }

    if (!address || address === "") {
        requiredInputErrors.errors = { "address": "Street address is required" }
        return res.json({requiredInputErrors})
    }

    if (!city || city === "") {
        requiredInputErrors.errors = { "city": "City is required" }
        return res.json({requiredInputErrors})
    }

    if (!state || state === "") {
        requiredInputErrors.errors = { "state": "State is required" }
        return res.json({requiredInputErrors})
    }

    if (!country || country === "") {
        requiredInputErrors.errors = { "country": "Country is required" }
        return res.json({requiredInputErrors})
    }

    if (!lat || lat === "") {
        requiredInputErrors.errors = { "lat": "Latitude is not valid" }
        return res.json({requiredInputErrors})
    }

    if (!lng || lng === "") {
        requiredInputErrors.errors = { "lng": "Longitude is not valid" }
        return res.json({requiredInputErrors})
    }

    if (!name || name === "") {
        requiredInputErrors.errors = { "name": "Name must be less than 50 characters" }
        return res.json({requiredInputErrors})
    }

    if (!description || !description === "") {
        requiredInputErrors.errors = { "description": "Description is required" }
        return res.json({requiredInputErrors})
    }

    if (!price || price === "") {
        requiredInputErrors.errors = { "price": "Price per day is required" }
        return res.json({requiredInputErrors})
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

module.exports = router;
