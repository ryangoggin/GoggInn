//Feature 3: Set up the router
const express = require('express');

const router = express.Router();

const { Booking, Spot, SpotImage, Review, ReviewImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// DELETE /api/spot-images/:imageId: Delete a Spot Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let spotImage = await SpotImage.findByPk(req.params.imageId);

    // SpotImage must exist to delete --> can make a 404 error handler on refactor
    if (!spotImage) {
        return res.status(404).json({
            message: "Spot Image couldn't be found",
            statusCode: 404
        });
    }

    // Spot must belong to current user
    let spot = await Spot.findByPk(spotImage.spotId);
    if (spot.ownerId !== currUserId) {
        return res.status(403).json({
            message: "Forbidden: Cannot delete images for spots you do not own",
            statusCode: 403
        });
    }

    spotImage.destroy();

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    });
});

//export the router for use in ./api/index.js
module.exports = router;
