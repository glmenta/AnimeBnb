const express = require('express');
const { Review,  ReviewImage } = require('../../db/models');
const { requireAuth, restoreUser } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', restoreUser, requireAuth, async (req, res) => {
    const userId = req.user.id
    const reviewImage = await ReviewImage.findByPk(req.params.imageId, {
        include: {
            model: Review
        }
    })

    if(reviewImage.Review.userId !== userId) {
        res.status(403).json({
            message: "User not authorized",
            statusCode: 403
        })
    }

    if(!reviewImage) {
        res.status(404).json({
            message: "Review Image couldn't be found",
            statusCode: 404
        })
    }

    await reviewImage.destroy()
    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})


module.exports = router
