//Feature 1: Set up the router
const express = require('express');

const router = express.Router();

const { Spot, Review, SpotImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// GET /api/spots: Get all Spots
router.get('/', async (req, res) => {
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

    return res.json({ Spots: POJOspots });
});

// GET /api/spots/current: Get all Spots owned by the Current User
router.get('/current', requireAuth, async (req, res) => {
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

    return res.json({ Spots: POJOspots });
});

// GET /api/spots/:spotId: Get details of a Spot from an id
router.get('/:spotId', async (req, res) => {
    let spot = await Spot.findByPk(req.params.spotId);

    // check is spot exists:
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    //convert to POJO
    spot = spot.toJSON();
    let spotId = spot.id;
    let ownerId = spot.ownerId;
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
    spot.numReviews = countRatings;
    spot.avgStarRating = avgRating;
    //SpotImages
    let images = await SpotImage.findAll({
        where: { spotId },
        attributes: ["id", "url", "preview"]
    });
    spot.SpotImages = images;
    //Owner
    let owner = await User.findOne({
        where: { id: ownerId },
        attributes: ["id", "firstName", "lastName"]
    });
    spot.Owner = owner;

    return res.json(spot);
});

// POST /api/spots: Create a Spot
router.post('/', requireAuth, async (req, res) => {
    let ownerId = req.user.id;

    let valError = {
        message: 'Validation Error',
        statusCode: 400
    };
    //validate spot --> create a validateSpot middleware fxn on refactor (gets 500 code, not 400 when validation set in spot.js violated)
    let {address, city, state, country, lat, lng, name, description, price} = req.body;
    if (!address) {
        valError.error = "Street address is required";
        return res.status(400).json(valError);
    } else if (!city) {
        valError.error = "City is required";
        return res.status(400).json(valError);
    } else if (!state) {
        valError.error = "State is required";
        return res.status(400).json(valError);
    } else if (!country) {
        valError.error = "Country is required";
        return res.status(400).json(valError);
    } else if (!lat || Number.isNaN(lat) || lat > 90 || lat < -90) {
        valError.error = "Latitude is not valid";
        return res.status(400).json(valError);
    } else if (!lng || Number.isNaN(lng) || lng > 180 || lng < -180) {
        valError.error = "Longitude is not valid";
        return res.status(400).json(valError);
    } else if (!name || name.length > 50) {
        valError.error = "Name is required and must be less than 50 characters";
        return res.status(400).json(valError);
    } else if (!description) {
        valError.error = "Description is required";
        return res.status(400).json(valError);
    } else if (!price) {
        valError.error = "Price per day is required";
        return res.status(400).json(valError);
    }

    const newSpot = await Spot.create({ownerId, ...req.body});

    return res.status(201).json(newSpot);
});

// POST /api/spots/:spotId/images: Add an Image to a Spot based on the Spot's id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let spot = await Spot.findByPk(req.params.spotId);

    // Spot must exist to add an image --> can make a 404 error handler on refactor
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    // Only authorized if currUser is the owner of the spot --> can make auth middleware on refactor
    let ownerId = spot.ownerId;
    if (currUserId !== ownerId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    const newImage = await SpotImage.create({ spotId: req.params.spotId, ...req.body });
    let {id, url, preview} = newImage;

    return res.status(201).json({id, url, preview});
});

// PUT /api/spots/:spotId
router.put('/:spotId', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let spot = await Spot.findByPk(req.params.spotId);

    // Spot must exist to add an image --> can make a 404 error handler on refactor
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    // Only authorized if currUser is the owner of the spot --> can make auth middleware on refactor
    let ownerId = spot.ownerId;
    if (currUserId !== ownerId) {
        return res.status(403).json({
            message: "Forbidden",
            statusCode: 403
        });
    }

    let valError = {
        message: 'Validation Error',
        statusCode: 400
    };
    //validate spot --> create a validateSpot middleware fxn on refactor (gets 500 code, not 400 when validation set in spot.js violated)
    let {address, city, state, country, lat, lng, name, description, price} = req.body;
    if (!address) {
        valError.error = "Street address is required";
        return res.status(400).json(valError);
    } else if (!city) {
        valError.error = "City is required";
        return res.status(400).json(valError);
    } else if (!state) {
        valError.error = "State is required";
        return res.status(400).json(valError);
    } else if (!country) {
        valError.error = "Country is required";
        return res.status(400).json(valError);
    } else if (!lat || Number.isNaN(lat) || lat > 90 || lat < -90) {
        valError.error = "Latitude is not valid";
        return res.status(400).json(valError);
    } else if (!lng || Number.isNaN(lng) || lng > 180 || lng < -180) {
        valError.error = "Longitude is not valid";
        return res.status(400).json(valError);
    } else if (!name || name.length > 50) {
        valError.error = "Name is required and must be less than 50 characters";
        return res.status(400).json(valError);
    } else if (!description) {
        valError.error = "Description is required";
        return res.status(400).json(valError);
    } else if (!price) {
        valError.error = "Price per day is required";
        return res.status(400).json(valError);
    }

    spot.update(req.body);

    return res.json(spot);
});

//export the router for use in ./api/index.js
module.exports = router;
