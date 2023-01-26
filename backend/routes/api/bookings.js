//Feature 3: Set up the router
const express = require('express');

const router = express.Router();

const { Booking, Spot, SpotImage, Review, ReviewImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

// GET /api/bookings/current: Get all of the Current User's Bookings
router.get('/current', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let bookings = await Booking.findAll({
        where: { userId: currUserId }
    });

    let POJObookings = []; // fill with reviews converted to POJOs

    //convert each booking to a POJO and add Spot
    for (let booking of bookings) {
        let spotId = booking.spotId;
        booking = booking.toJSON();
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
        booking.Spot = spot;
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

    return res.json({ Reviews: POJObookings });
});

//export the router for use in ./api/index.js
module.exports = router;
