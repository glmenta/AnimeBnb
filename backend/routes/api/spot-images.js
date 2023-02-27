const express = require('express');
const { Spot, SpotImage} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const router = express.Router();

router.delete('/:imageId', requireAuth, async (req, res) => {
    const userId = req.user.id
    const imageId = req.params.imageId
    const findImage = await SpotImage.findByPk(imageId, {
        include: {
            model: Spot.scope('spotInfo')
        }
    })

    if(!findImage) {
        res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        })
    }

    if(findImage.Spot.ownerId !== userId) {
        res.status(403).json({
            message: 'User not authorized',
            statusCode: 403
        })
    }

    await findImage.destroy()

    res.status(200).json({
        message: "Successfully deleted",
        statusCode: 200
    })
})


module.exports = router
