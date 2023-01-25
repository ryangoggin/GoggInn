//Feature 2: Set up the router
const express = require('express');

const router = express.Router();

const { Spot, Review, ReviewImage, User, sequelize } = require('../../db/models');
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
        //START HERE TOMORROW!
    }

    return res.json({ Reviews: POJOreviews });
});

//export the router for use in ./api/index.js
module.exports = router;
