//Feature 1: Set up the router
const express = require('express');

const router = express.Router();

const { Spot, Review, SpotImage, ReviewImage, User, Booking, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');
const { Op } = require("sequelize");

// GET /api/spots: Get all Spots --> Add Query Filters to Get All Spots
router.get('/', async (req, res) => {
    //set up to add specific query validation errors as they occur
    let queryValError = {
        message: "Validation Error",
        statusCode: 400,
        errors: {}
    };

    // set up pagination for queries
    let {page, size} = req.query;
    if (!page) page = 1; //default page is 1
    if (!size) size = 20; //default size is 20
    page = parseFloat(page); //req.query is string!
    size = parseFloat(size); //req.query is string!

    let pagination = {}; //needs to be spread in the spots query below!

    // use equations to get offset and limit from page and size:
    if (Number.isInteger(page) && page >= 1 && page <= 10 && Number.isInteger(size) && size >= 1 && size <= 20) {
        pagination.offset = size * (page - 1);
        pagination.limit = size;
    }
    // specify page or size for val error
    else {
        if (isNaN(page) || !Number.isInteger(page) || page < 1 || page > 10) {
            queryValError.errors.page = "Page must be an integer greater than or equal to 1 and less than or equal to 10";
        }
        if (isNaN(size) || !Number.isInteger(size) || size < 1 || size > 20) {
            queryValError.errors.size = "Size must be an integer greater than or equal to 1 and less than or equal to 20";
        }
        res.status(400).json(queryValError);
    }

    let where = {}; //needs to be used in the spots query below!

    //building filters for the spots query below --> NOTE: to improve query speed add indexes to lat, lng, and price in migration file so SQL searches instead of scans for the query
    //helper function to check lat/lng decimals do not exceed 7 places:
    let isLatLngFormat = (decimal) => {
        //need to account for extra decimal being 0s, measure length of decimals after splitting by "."
        let decimals = decimal.split(".")[1];
        if (decimals) {
            if (decimals.length > 7) return false;
        }
        return true;
    }

    //BOTH minLat and maxLat filter:
    if (req.query.minLat && req.query.maxLat) {
        // if minLat OR maxLat are invalid
        if ((isNaN(req.query.minLat) || !isLatLngFormat(req.query.minLat) || req.query.minLat < -90) || (isNaN(req.query.maxLat) || !isLatLngFormat(req.query.maxLat) || req.query.maxLat > 90)) {
            //adds minLat error msg if it's invalid
            if (isNaN(req.query.minLat) || !isLatLngFormat(req.query.minLat) || req.query.minLat < -90) {
                queryValError.errors.minLat = "Minimum latitude is invalid";
            }
            //adds maxLat error msg if it's invalid
            if (isNaN(req.query.maxLat) || !isLatLngFormat(req.query.maxLat) || req.query.maxLat > 90) {
                queryValError.errors.maxLat = "Maximum latitude is invalid";
            }
            res.status(400).json(queryValError);
        }
        //  if BOTH are valid, filter between them
        else {
            where.lat = {[Op.between] : [req.query.minLat, req.query.maxLat]};
        }
    }

    //minLat filter:
    if (req.query.minLat && !req.query.maxLat) {
        if (isNaN(req.query.minLat) || !isLatLngFormat(req.query.minLat) || req.query.minLat < -90) {
            queryValError.errors = {
                minLat: "Minimum latitude is invalid"
            };
            res.status(400).json(queryValError);
        } else {
            // if valid, filter greater than or equal to minLat
            where.lat = {[Op.gte] : req.query.minLat};
        }
    }

    //maxLat filter:
    if (req.query.maxLat && !req.query.minLat) {
        if (isNaN(req.query.maxLat) || !isLatLngFormat(req.query.maxLat) || req.query.maxLat > 90) {
            queryValError.errors = {
                maxLat: "Maximum latitude is invalid"
            };
            res.status(400).json(queryValError);
        } else {
            // if valid, filter less than or equal to maxLat
            where.lat = {[Op.lte] : req.query.maxLat};
        }
    }

    //BOTH minLng and maxLng filter:
    if (req.query.minLng && req.query.maxLng) {
        // if minLng OR maxLng are invalid
        if ((isNaN(req.query.minLng) || !isLatLngFormat(req.query.minLng) || req.query.minLng < -180) || (isNaN(req.query.maxLng) || !isLatLngFormat(req.query.maxLng) || req.query.maxLng > 180)) {
            //adds minLng error msg if it's invalid
            if (isNaN(req.query.minLng) || !isLatLngFormat(req.query.minLng) || req.query.minLng < -180) {
                queryValError.errors.minLng = "Minimum longitude is invalid";
            }
            //adds maxLng error msg if it's invalid
            if (isNaN(req.query.maxLng) || !isLatLngFormat(req.query.maxLng) || req.query.maxLng > 180) {
                queryValError.errors.maxLng = "Maximum longitude is invalid";
            }
            res.status(400).json(queryValError);
        }
        //  if BOTH are valid, filter between them
        else {
            where.lng = {[Op.between] : [req.query.minLng, req.query.maxLng]};
        }
    }

    //minLng filter:
    if (req.query.minLng && !req.query.maxLng) {
        if (isNaN(req.query.minLng) || !isLatLngFormat(req.query.minLng) || req.query.minLng < -180) {
            queryValError.errors = {
                minLng: "Minimum longitude is invalid"
            };
            res.status(400).json(queryValError);
        } else {
            // if valid, filter greater than or equal to minLng
            where.lng = {[Op.gte] : req.query.minLng};
        }
    }

    //maxLng filter:
    if (req.query.maxLng && !req.query.minLng) {
        if (isNaN(req.query.maxLng) || !isLatLngFormat(req.query.maxLng) || req.query.maxLng > 180) {
            queryValError.errors = {
                maxLng: "Maximum longitude is invalid"
            };
            res.status(400).json(queryValError);
        } else {
            // if valid, filter less than or equal to maxLng
            where.lng = {[Op.lte] : req.query.maxLng};
        }
    }

    //helper function to check price decimals do not exceed 2 places:
    let isDollarFormat = (decimal) => {
        //need to account for extra decimal being 0s, measure length of decimals after splitting by "."
        let decimals = decimal.split(".")[1];
        if (decimals) {
            if (decimals.length > 2) return false;
        }
        return true;
    }

    //BOTH minPrice and maxPrice filter:
    if (req.query.minPrice && req.query.maxPrice) {
        // if minPrice OR maxPrice are invalid
        if ((isNaN(req.query.minPrice) || !isDollarFormat(req.query.minPrice) || req.query.minPrice < 0) || (isNaN(req.query.maxPrice) || !isDollarFormat(req.query.maxPrice) || req.query.maxPrice < 0)) {
            //adds minPrice error msg if it's invalid
            if (isNaN(req.query.minPrice) || !isDollarFormat(req.query.minPrice) || req.query.minPrice < 0) {
                queryValError.errors.minPrice = "Minimum price must be valid and greater than or equal to 0";
            }
            //adds maxPrice error msg if it's invalid
            if (isNaN(req.query.maxPrice) || !isDollarFormat(req.query.maxPrice) || req.query.maxPrice < 0) {
                queryValError.errors.maxPrice = "Maximum price must be valid and greater than or equal to 0";
            };
            res.status(400).json(queryValError);
        }
        //  if BOTH are valid, filter between them
        else {
            where.price = {[Op.between] : [req.query.minPrice, req.query.maxPrice]};
        }
    }

    //minPrice filter:
    if (req.query.minPrice && !req.query.maxPrice) {
        if (isNaN(req.query.minPrice) || !isDollarFormat(req.query.minPrice) || req.query.minPrice < 0) {
            queryValError.errors = {
                minPrice: "Minimum price must be valid and greater than or equal to 0"
            };
            res.status(400).json(queryValError);
        } else {
            // if valid, filter greater than or equal to minPrice
            where.price = {[Op.gte] : req.query.minPrice};
        }
    }

    //maxPrice filter:
    if (req.query.maxPrice && !req.query.minPrice) {
        if (isNaN(req.query.maxPrice) || !isDollarFormat(req.query.maxPrice) || req.query.maxPrice < 0) {
            queryValError.errors = {
                maxPrice: "Maximum price must be valid and greater than or equal to 0"
            };
            res.status(400).json(queryValError);
        } else {
            // if valid, filter less than or equal to maxPrice
            where.price = {[Op.lte] : req.query.maxPrice};
        }
    }

    //query for all Spots using req.query from where and ...pagination
    const spots = await Spot.findAll({
        where,
        ...pagination
    });
    let POJOspots = [];

    //convert all spots to JSON to add avgRating and previewImage
    for (let spot of spots) {
        spot = spot.toJSON();
        let spotId = spot.id;
        //avgRating
        let reviews = await Review.findAll({
            where: { spotId },
            attributes: [
                // REFACTOR: use Review.count({ where: {} }) and Review.sum({ where: {} }), there's also a sequelize.fn('avg) function that can be used too
                [sequelize.fn('count', sequelize.col('stars')), 'countRatings'],
                [sequelize.fn('sum', sequelize.col('stars')), 'sumRatings']
            ]
        });
        let countRatings = reviews[0].dataValues.countRatings;
        let sumRatings = reviews[0].dataValues.sumRatings;
        let avgRating = sumRatings/countRatings;
        spot.avgRating = avgRating.toFixed(1); //round to 1 decimal place
        //previewImage
        let image = await SpotImage.findOne({
            where: { spotId }
        });
        if (image) {
            let imageURL = image.url;
            spot.previewImage = imageURL;
        } else {
            spot.previewImage = null;
        }
        //push into new arr to send as res
        POJOspots.push(spot);
    }

    return res.json({ Spots: POJOspots, page: page, size: size });
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
                // REFACTOR: use Review.count({ where: {} }) and Review.sum({ where: {} }), there's also a sequelize.fn('avg) function that can be used too
                [sequelize.fn('count', sequelize.col('stars')), 'countRatings'],
                [sequelize.fn('sum', sequelize.col('stars')), 'sumRatings']
            ]
        });
        let countRatings = reviews[0].dataValues.countRatings;
        let sumRatings = reviews[0].dataValues.sumRatings;
        let avgRating = sumRatings/countRatings;
        spot.avgRating = avgRating.toFixed(1); //round to 1 decimal place
        //previewImage
        let image = await SpotImage.findOne({
            where: { spotId }
        });
        if (image) {
            let imageURL = image.url;
            spot.previewImage = imageURL;
        } else {
            spot.previewImage = null;
        }
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
            // REFACTOR: use Review.count({ where: {} }) and Review.sum({ where: {} }), there's also a sequelize.fn('avg) function that can be used too
            [sequelize.fn('count', sequelize.col('stars')), 'countRatings'],
            [sequelize.fn('sum', sequelize.col('stars')), 'sumRatings']
        ]
    });
    let countRatings = reviews[0].dataValues.countRatings;
    let sumRatings = reviews[0].dataValues.sumRatings;
    let avgRating = sumRatings/countRatings;
    spot.numReviews = parseInt(countRatings);
    spot.avgStarRating = avgRating.toFixed(1); //round to 1 decimal place
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

// POST /api/spots: Create a Spot --> results in server error for getting spots until after image is created, refactor to avoid this
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

    return res.json({id, url, preview});
});

// PUT /api/spots/:spotId: Edit a Spot
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

// DELETE /api/spots/:spotId: Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
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

    spot.destroy();

    return res.json({
        message: "Successfully deleted",
        statusCode: 200
    });
});

// Feature 2: Reviews --> GET /api/spots/:spotId/reviews: Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    let reviews = await Review.findAll({
        where: { spotId: req.params.spotId }
    });

    //for 404 purposes:
    let spot = await Spot.findByPk(req.params.spotId);

    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    let POJOreviews = []; //fill with each review converted to POJO

    for (let review of reviews) {
        let reviewId = review.id;
        let userId = review.userId;
        review = review.toJSON();
        //User
        let user = await User.findOne({
            where: { id: userId },
            attributes: ['id', 'firstName', 'lastName']
        });
        review.User = user;
        //ReviewImages
        let reviewImages = await ReviewImage.findAll({
            where: { reviewId },
            attributes: ['id', 'url']
        });
        review.ReviewImages = reviewImages;

        POJOreviews.push(review);
    }

    return res.json({ Reviews: POJOreviews });
});

// Feature 2: Reviews --> POST /api/spots/:spotId/reviews
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let spot = await Spot.findByPk(req.params.spotId);

    // Spot must exist to add review --> can make a 404 error handler on refactor
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    // Only authorized if currUser hasn't made a review for this spot yet --> can make auth middleware on refactor
    let spotReviews = await Review.findAll({
        where: { spotId: spot.id }
    });
    for (let review of spotReviews) {
        if (currUserId === review.userId) {
            return res.status(403).json({
                message: "User already has a review for this spot",
                statusCode: 403
            });
        }
    }

    let valError = {
        message: 'Validation Error',
        statusCode: 400
    };
    //validate spot --> create a validateSpot middleware fxn on refactor (gets 500 code, not 400 when validation set in spot.js violated)
    let {review, stars} = req.body;
    if (!review) {
        valError.error = "Review text is required";
        return res.status(400).json(valError);
    } else if (!stars || !Number.isInteger(stars) || stars < 0 || stars > 5) {
        valError.error = "Stars must be an integer from 1 to 5";
        return res.status(400).json(valError);
    }

    const newReview = await Review.create({ userId: currUserId, spotId: parseInt(req.params.spotId), ...req.body });

    return res.status(201).json(newReview);
});

// Feature 3: Bookings --> // GET /api/:spotId/bookings: Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let spot = await Spot.findByPk(req.params.spotId);

    // Spot must exist to check bookings --> can make a 404 error handler on refactor
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    //Success response if you ARE NOT the spot owner
    let ownerId = spot.ownerId;
    if (currUserId !== ownerId) {
        let bookings = await Booking.findAll({
            where: { spotId: spot.id },
            attributes: ["spotId", "startDate", "endDate"]
        });

        let POJObookings = []; // fill with reviews converted to POJOs

        //convert each booking to a POJO to convert start and end Date objects
        for (let booking of bookings) {
            booking = booking.toJSON();
            //converting start and end Date to yyyy-mm-dd
            let startDate = booking.startDate.toISOString().slice(0, 10);
            booking.startDate = startDate;
            let endDate = booking.endDate.toISOString().slice(0, 10);
            booking.endDate = endDate;

            POJObookings.push(booking);
        }

        return res.json({ Bookings: POJObookings });
    }
    //Success response if you ARE the spot owner
    else {
        let bookings = await Booking.findAll({
            where: { spotId: spot.id }
        });

        let POJObookings = []; // fill with reviews converted to POJOs

        //convert each booking to a POJO to convert start and end Date objects
        for (let booking of bookings) {
            booking = booking.toJSON();
            //User
            let userId = booking.userId;
            let user = await User.findOne({
                where: { id: userId },
                attributes: ['id', 'firstName', 'lastName']
            });
            booking.User = user;
            //converting start and end Date to yyyy-mm-dd
            let startDate = booking.startDate.toISOString().slice(0, 10);
            booking.startDate = startDate;
            let endDate = booking.endDate.toISOString().slice(0, 10);
            booking.endDate = endDate;
            //converting createdAt and updatedAT to yyyy-mm-dd hh:mm:ss
            let createdAtDate = booking.createdAt.toISOString().slice(0, 10);
            let createdAtTime = booking.createdAt.toISOString().slice(11, 19);
            booking.createdAt = `${createdAtDate} ${createdAtTime}`;
            let updatedAtDate = booking.updatedAt.toISOString().slice(0, 10);
            let updatedAtTime = booking.updatedAt.toISOString().slice(11, 19);
            booking.updatedAt = `${updatedAtDate} ${updatedAtTime}`;

            POJObookings.push(booking);
        }

        return res.json({ Bookings: POJObookings });
    }
});

// Feature 3: Bookings --> POST /api/spots/:spotId/bookings: Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let spot = await Spot.findByPk(req.params.spotId);

    // Spot must exist to create bookings --> can make a 404 error handler on refactor
    if (!spot) {
        return res.status(404).json({
            message: "Spot couldn't be found",
            statusCode: 404
        });
    }

    // Spot must NOT belong to current user
    if (spot.ownerId === currUserId) {
        return res.status(403).json({
            message: "Forbidden: Cannot book spots you own",
            statusCode: 403
        });
    }

    // Check that endDate is not on or before startDate:
    let {startDate, endDate} = req.body;
    startDate = new Date(startDate);
    endDate = new Date(endDate);

    let compStart = startDate.getTime();
    let compEnd = endDate.getTime();
    if (compEnd <= startDate) {
        return res.status(400).json({
            message: "Validation error",
            statusCode: 400,
            errors: {
              endDate: "endDate cannot be on or before startDate"
            }
        })
    }

    // Check each booking for spot, compare start and end Dates to created booking to avoid conflicts
    let bookings = await Booking.findAll({
        where: { spotId: spot.id }
    });
    for (let booking of bookings) {
        // to avoid conflicts from time, run booking's through .toISOString() and slice 0, 10 to get rid of time.
        let bookingStartDate = new Date(booking.startDate.toISOString().slice(0, 10));
        let bookingEndDate = new Date(booking.endDate.toISOString().slice(0, 10));

        // convert to comparable values with .getTime()
        let compBookStart = bookingStartDate.getTime();
        let compBookEnd = bookingEndDate.getTime();

        // create bookingConflict obj to send as response in case of booking conflict:
        let bookingConflict = {
            message: "Sorry, this spot is already booked for the specified dates",
            statusCode: 403
        };

        // startDate conflicts with booking:
        if (compStart >= compBookStart && compStart <= compBookEnd) {
            // add startDate error to bookingConflict
            bookingConflict.errors = {startDate: "Start date conflicts with an existing booking"}
            return res.status(403).json(bookingConflict);
        }
        // endDate conflicts with booking:
        else if (compEnd >= compBookStart && compEnd <= compBookEnd) {
            // add endDate error to bookingConflict
            bookingConflict.errors = {endDate: "End date conflicts with an existing booking"}
            return res.status(403).json(bookingConflict);
        }
        // startDate and endDate envelope current booking:
        else if (compStart < compBookStart && compEnd > compBookEnd) {
            // add both startDate and endDate error to bookingConflict
            bookingConflict.errors = {
                startDate: "Start date conflicts with an existing booking",
                endDate: "End date conflicts with an existing booking"
            }
            return res.status(403).json(bookingConflict);
        }
    }
    // Create new booking if no booking conflicts:
    let newBooking = await Booking.create({ spotId: parseInt(req.params.spotId), userId: currUserId, ...req.body });

    // convert newBooing to POJO to convert start and end Dates and createdAt/updatedAt formatting:
    newBooking = newBooking.toJSON();

    //converting start and end Date to yyyy-mm-dd
    let newStartDate = newBooking.startDate.toISOString().slice(0, 10);
    newBooking.startDate = newStartDate;
    let newEndDate = newBooking.endDate.toISOString().slice(0, 10);
    newBooking.endDate = newEndDate;
    //converting createdAt and updatedAT to yyyy-mm-dd hh:mm:ss
    let createdAtDate = newBooking.createdAt.toISOString().slice(0, 10);
    let createdAtTime = newBooking.createdAt.toISOString().slice(11, 19);
    newBooking.createdAt = `${createdAtDate} ${createdAtTime}`;
    let updatedAtDate = newBooking.updatedAt.toISOString().slice(0, 10);
    let updatedAtTime = newBooking.updatedAt.toISOString().slice(11, 19);
    newBooking.updatedAt = `${updatedAtDate} ${updatedAtTime}`;


    return res.json(newBooking);
});


//export the router for use in ./api/index.js
module.exports = router;
