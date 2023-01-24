//Feature 1: Set up the router
const express = require('express');

const router = express.Router();

const { Spot, Review, SpotImage, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// GET /api/spots: Get all Spots
router.get('/', async(req, res) => {
    const spots = await Spot.findAll();
    let POJOspots = [];

    //convert all spots to JSON to add avgRating and previewImage
    for (let spot of spots) {
        spot = spot.toJSON();
        let spotId = spot.id;
        //avgRating
        let reviews = await Review.findAll({
            where: { spotId },
            attributes: [
                [sequelize.fn('count', sequelize.col('stars')), 'countRatings'],
                [sequelize.fn('sum', sequelize.col('stars')), 'sumRatings']
            ]
        });
        let countRatings = reviews[0].dataValues.countRatings;
        let sumRatings = reviews[0].dataValues.sumRatings;
        let avgRating = sumRatings/countRatings;
        spot.avgRating = avgRating;
        //previewImage
        let image = await SpotImage.findOne({
            where: { spotId }
        });
        let imageURL = image.url;
        spot.previewImage = imageURL;
        //push into new arr to send as res
        POJOspots.push(spot);
    }

    res.json({
        Spots: POJOspots
    });
});

// GET /api/spots/current: Get all Spots owned by the Current User
router.get('/current', requireAuth, async(req, res) => {
    let currUserId = req.user.id;
    let spots = await Spot.findAll({
        where: { ownerId: currUserId }
    });

    let POJOspots = []; // --> make for loop to add avgRating and imageURL a helper fxn on refactor

    //convert all spots to JSON to add avgRating and previewImage
    for (let spot of spots) {
        spot = spot.toJSON();
        let spotId = spot.id;
        //avgRating
        let reviews = await Review.findAll({
            where: { spotId },
            attributes: [
                [sequelize.fn('count', sequelize.col('stars')), 'countRatings'],
                [sequelize.fn('sum', sequelize.col('stars')), 'sumRatings']
            ]
        });
        let countRatings = reviews[0].dataValues.countRatings;
        let sumRatings = reviews[0].dataValues.sumRatings;
        let avgRating = sumRatings/countRatings;
        spot.avgRating = avgRating;
        //previewImage
        let image = await SpotImage.findOne({
            where: { spotId }
        });
        let imageURL = image.url;
        spot.previewImage = imageURL;
        //push into new arr to send as res
        POJOspots.push(spot);
    }

    res.json({
        Spots: POJOspots
    });
});


//export the router for use in ./api/index.js
module.exports = router;
