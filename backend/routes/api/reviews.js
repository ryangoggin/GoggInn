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

// POST /api/reviews/:reviewId/images: Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let review = await Review.findByPk(req.params.reviewId)

    // Review must exist to add an image --> can make a 404 error handler on refactor
    if (!review) {
        return res.status(404).json({
            message: "Review couldn't be found",
            statusCode: 404
        });
    }

    // Only authorized if currUser is the one who created the review --> can make auth middleware on refactor
    let userId = review.userId;
    if (currUserId !== userId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    // Cannot add more than 10 images --> could also refactor to use count aggregate
    let reviewImages = await ReviewImage.findAll({
        where: { reviewId: review.id }
    });
    if (reviewImages.length >= 10) {
        return res.status(403).json({
            message: "Maximum number of images for this resource was reached",
            statusCode: 403
        });
    }

    const newImage = await ReviewImage.create({ reviewId: req.params.reviewId, ...req.body });
    let {id, url} = newImage;

    return res.status(201).json({id, url});
});


//export the router for use in ./api/index.js
module.exports = router;
