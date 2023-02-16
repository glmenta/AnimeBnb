const express = require('express')
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

//get all spots
router.get('/', async (req,res) => {
    const Spots = await Spot.findAll()
    res.status(200).json({Spots})
})

//get all spots by spotId
router.get('/:spotId', async (req,res) => {
    const id = req.params.spotId
    const allSpots = await Spot.findByPk(id, {
        include:[
            { model: User },
            { model: Review },
            { model: SpotImage }
        ]
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
router.get('/current', async (req,res) => {
    let currentUser = await User.findByPk()
})

//create a spot
router.post('/', requireAuth, async (req,res) => {
    const id = req.params.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const ownerId = await User.findByPk(id)
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
    if (newSpot) { return res.status(201).json(newSpot) }
    else return res.status(400).json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
          "address": "Street address is required",
          "city": "City is required",
          "state": "State is required",
          "country": "Country is required",
          "lat": "Latitude is not valid",
          "lng": "Longitude is not valid",
          "name": "Name must be less than 50 characters",
          "description": "Description is required",
          "price": "Price per day is required"
        }
      })
})
module.exports = router;
