//Feature 3: Set up the router
const express = require('express');

const router = express.Router();

const { Booking, Spot, SpotImage, Review, ReviewImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// DELETE /api/review-images/:imageId: Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let reviewImage = await ReviewImage.findByPk(req.params.imageId);

    // ReviewImage must exist to delete --> can make a 404 error handler on refactor
    if (!reviewImage) {
        return res.status(404).json({
            message: "Review Image couldn't be found",
            statusCode: 404
        });
    }

    // Review must belong to current user
    let review = await Review.findByPk(reviewImage.reviewId);
    if (review.userId !== currUserId) {
        return res.status(403).json({
            message: "Forbidden: Cannot delete images for reviews you do not own",
            statusCode: 403
        });
    }

    reviewImage.destroy();

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    });
});

//export the router for use in ./api/index.js
module.exports = router;
