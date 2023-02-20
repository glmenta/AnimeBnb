const express = require('express')
const { restoreUser, requireAuth } = require('../../utils/auth');
const { Spot, SpotImage, Review, User, ReviewImage, Sequelize } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const router = express.Router();

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
//get all reviews of current user
router.get('/current', restoreUser, requireAuth, async (req,res) => {
    const userId = req.user.id
    const userReviews = await Review.findByPk(userId)
    if(userReviews) {
        allReviews = await Review.findAll( { where: { userId: userId },
            attributes: ['id', 'userId', 'spotId', 'review', 'stars', 'createdAt', 'updatedAt'],
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName']},
                { model: Spot, attributes: ['id', 'ownerId', 'address', 'city',
                'state', 'country', 'lat', 'lng', 'name', 'price',
                //  [Sequelize.col('SpotImages.url'), 'preview']],
            ], include: { model: SpotImage, attributes: [[Sequelize.col('url'), 'preview']]}},
                { model: ReviewImage, attributes: ['id', 'url']},
                { model: SpotImage, attributes: []}
            ],
            group: ['Review.id']
        })
        res.status(200)
        return res.json({'Reviews': allReviews })
    }
})



//add img to review based on review id
router.post('/:reviewId/images', requireAuth, async(req,res) => {
    const reviewId = req.params.reviewId
    const review = await Review.findOne({ where: { id: reviewId }})
    const { url } = req.body

    if (!review) {
        return res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    }

    const revImage = await ReviewImage.create({
        reviewId: parseInt(reviewId),
        url
    })

    if (revImage) {
        res.status(200).json({revImage})
    }
})
//edit review

//delete review


module.exports = router;
