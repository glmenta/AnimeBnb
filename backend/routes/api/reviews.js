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

//get all reviews of current use
router.get('/current', restoreUser, requireAuth, async (req,res) => {
    const userId = req.user.id

    const currentReviews = await Review.findAll( { where: { userId: userId },
        include: [
             { model: User, attributes:
                ['id', 'firstName', 'lastName']
            },
             { model: Spot.scope('spotInfo'), attributes:
                ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price']
            },
            { model: ReviewImage, attributes:
                ['id', 'url']
            },
        ],
    })

    if (currentReviews.length === 0) {
        res.status(404).json({
            message: "User has no reviews",
            statusCode: 404
        })
    }

    for (let review of currentReviews) {
        const prevImg = await SpotImage.findOne({
          where: { spotId: review.Spot.id, preview: true },
        });
        if (prevImg) {
          review.Spot.dataValues.previewImage = prevImg.url;
        } else {
          review.Spot.dataValues.previewImage = "No Preview Image";
        }
      }
      return res.json({ Reviews: currentReviews });
})

//add img to review based on review id
router.post('/:reviewId/images', restoreUser, requireAuth, async(req,res) => {
    const reviewId = req.params.reviewId
    const userId = req.user.id
    const { url } = req.body

    const review = await Review.findOne({ where: { id: reviewId }})

    if (!review) {
        return res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    }

    const maxImgsCheck = await ReviewImage.findAll({ where: { reviewId }})

    if (maxImgsCheck.length >= 10) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
          })
    }

    if (userId === review.userId) {
        const reviewImage = await ReviewImage.create({
            reviewId: parseInt(reviewId),
            url
        })
        return res.status(200).json({
            id: reviewImage.id,
            url: reviewImage.url
        })
    } else {
        return res.status(403).json({ 'Message':'User is not authorized' })
    }
})

//edit review
router.put('/:reviewId', restoreUser, requireAuth, validateReview, async(req,res) => {
    const reviewId = req.params.reviewId
    const userId = req.user.id
    const checkReview = await Review.findByPk(reviewId)
    const { review, stars } = req.body

    if(!checkReview) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
          })
    }

    if (userId === checkReview.userId) {
        await checkReview.update({review, stars})
        return res.status(200).json(checkReview)
    } else {
        return res.status(403).json({ 'Message':'User is not authorized' })
    }
})

//delete review
router.delete('/:reviewId', restoreUser, requireAuth, async(req,res) => {
    const reviewId = req.params.reviewId
    const userId = req.user.id
    const checkReview = await Review.findByPk(reviewId)

    if (!checkReview) {
        res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }

    if (userId === checkReview.userId) {
        await checkReview.destroy()
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    } else {
        return res.status(403).json({ 'Message':'User is not authorized' })
    }
})

module.exports = router;
