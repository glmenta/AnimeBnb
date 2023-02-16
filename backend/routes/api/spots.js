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
    const spotId = 1
    const Spot = await Spot.findByPk(spotId, {
        // include: {
        //     [ model: User ],
        //     [ model: Review ],
        //     [ model: SpotImage]
        // }
    })
    res.status(200).json({Spot})
})

//get all spots by current user
// router.get('/current', async (req,res) => {

// })

module.exports = router;
