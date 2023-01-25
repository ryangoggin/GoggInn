//Feature 2: Set up the router
const express = require('express');

const router = express.Router();

const { Spot, SpotImage, Review, ReviewImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// GET /api/reviews/current: Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let reviews = await Review.findAll({
        where: { userId: currUserId }
    });

    let POJOreviews = []; // fill with reviews converted to POJOs

    //convert each review to a POJO and add Spot, User, and ReviewImage
    for (let review of reviews) {
        let reviewId = review.id;
        review = review.toJSON();
        let spotId = review.spotId;
        //User
        let user = await User.findOne({
            where: { id: currUserId },
            attributes: ['id', 'firstName', 'lastName']
        });
        review.User = user;
        //Spot
        let spot = await Spot.findOne({
            where: { id: spotId },
            attributes: { exclude: ['createdAt', 'updatedAt'] }
        });
        spot = spot.toJSON();
            //previewImage
            let previewImage = await SpotImage.findOne({
                where: { preview: true },
                raw: true
            });
        spot.previewImage = previewImage.url;
        review.Spot = spot;
        //ReviewImages
        let reviewImages = await ReviewImage.findAll({
            where: { reviewId },
            attributes: ['id', 'url']
        });
        review.reviewImages = reviewImages;

        POJOreviews.push(review);
    }
    return res.json({ Reviews: POJOreviews });
});



//export the router for use in ./api/index.js
module.exports = router;
