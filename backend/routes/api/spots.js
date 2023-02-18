const express = require('express')
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, Sequelize } = require('../../db/models');

const { Session } = require('./session');
const router = express.Router();

//get all spots
router.get('/', async (req,res) => {
    const spots = await Spot.findAll({
        attributes: ['id', 'ownerId', 'address', 'city',
        'state', 'country', 'lat', 'lng', 'name', 'description',
        'price', 'createdAt', 'updatedAt']
    })
    res.status(200).json({spots})
})

//get all spots by current user
router.get('/current', restoreUser, requireAuth, async (req,res) => {
    const userId = req.user.id
    const userSpots = await Spot.findByPk(userId);
    if (userSpots) {
        currSpots = await Spot.findAll({ where: { ownerId: userId }})
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
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
            [Sequelize.col('SpotImages.url'), 'preview']],
            include: [
                { model: Review, attributes: []},
                { model: SpotImage },
                { model: User, as: 'Owner' }
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
router.post('/', requireAuth, async (req,res) => {
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
router.post('/:spotId/images', requireAuth, async (req,res) => {
    const id = req.params.spotId
    const spot = await Spot.findOne({where: { id }});
    const { url, preview } = req.body

    if (spot) {
        const newImage = await SpotImage.create({
        spotId: id,
        url,
        preview
        }, {
            attributes: { exclude: ['spotId', 'createdAt', 'updatedAt']}
        });

    if (newImage) {
        return res.status(200).json(newImage)
        }
    }
    else {
        return res.status(404).json({ "message": "Spot couldn't be found", "statusCode": 404 }
    )}
})

//edit a spot
router.put('/:spotId', requireAuth, async(req,res) => {
    const id = req.params.spotId
    const spot = await Spot.findByPk(id)
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    if (!spot || spot.id === null) {
        return res.json({
            message: "Spot couldn't be found",
            statusCode: 404
        })
    }
    await spot.update({
        address, city, state, country, lat, lng, name, description, price
    })
    return res.status(200).json(spot)
})

//delete a spot
router.delete('/:spotId', requireAuth, async(req,res) => {
    const id = req.params.spotId
    const spot = await Spot.findByPk(id)
    if (!spot) {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    await spot.destroy()
    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

module.exports = router;
