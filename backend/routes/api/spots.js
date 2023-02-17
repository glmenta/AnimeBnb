const express = require('express')
const { requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');

const { Session } = require('./session');
const router = express.Router();

//get all spots
router.get('/', async (req,res) => {
    const Spots = await Spot.findAll()
    res.status(200).json({Spots})
})

//get details of a spot by spotId
router.get('/:spotId', async (req,res) => {
    const id = req.params.spotId
    const allSpots = await Spot.findByPk(id, {
        include:[
            { model: User },
            { model: Review },
            { model: SpotImage }
        ],
        attributes: ['id', 'ownerId', 'address', 'city',
        'state', 'country', 'lat', 'lng', 'name', 'description',
        'price', 'createdAt', 'updatedAt']
    })
    if (allSpots) {
        res.status(200).json(allSpots)
    } else {
        res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})

//get all spots by current user
router.get('/current', requireAuth, async (req,res) => {
    const spots = await Spot.find({ ownerId: req.user.id});
    res.status(200).json({Spots: spots })
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
    const { url, previewImage } = req.body
    const spot = await Spot.findByPk(id);
    const newImage = await SpotImage.create({
        url,
        previewImage
    })
    if (newImage) {
        return res.status(200).json(SpotImage)
    }
    else return res.status(404).json({ "message": "Spot couldn't be found", "statusCode": 404 })
})

//edit a spot
router.put(':spotId', requireAuth, async(req,res) => {
    const id = req.params.spotId
    const { address, city, state, country, lat, lng, name, description, price } = req.body

})

//delete a spot
router.delete('/:spotId', requireAuth, async(req,res) => {
    const id = req.params.spotId
    const spot = await Spot.findByPk(id)
    if (spot) {
        await spot.destroy()
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
    res.status(404).json({
        "message": "Spot couldn't be found",
        "statusCode": 404
    })
})

module.exports = router;
