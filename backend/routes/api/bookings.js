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

    return res.json({ Bookings: POJObookings });
});

// PUT /api/bookings/:bookingId: Edit a Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    let currUserId = req.user.id;
    let editBooking = await Booking.findByPk(req.params.bookingId);

    // Booking must exist to edit --> can make a 404 error handler on refactor
    if (!editBooking) {
        return res.status(404).json({
            message: "Booking couldn't be found",
            statusCode: 404
        });
    }

    // Booking must belong to current user
    if (editBooking.userId !== currUserId) {
        return res.status(403).json({
            message: "Forbidden: Cannot edit other user's bookings",
            statusCode: 403
        });
    }

    // Check that req endDate is not on or before req startDate (need to convert to Date objects to use .getTime()):
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
        });
    }

    // Check that editBooking isn't in the past (need to convert to Date objects to use .getTime()): --> refactor to prevent changing startDate if booking in progress?
    let compToday = Date.now();
    let editEnd = editBooking.endDate;
    editEnd = new Date(editEnd);

    let compEditEnd = editEnd.getTime();
    if (compEditEnd <= compToday) {
        return res.status(403).json({
            message: "Past bookings can't be modified",
            statusCode: 403
          });
    }

    // Check each booking for currUser, compare start and end Dates to created booking to avoid conflicts
    let bookings = await Booking.findAll({
        where: { userId: currUserId }
    });
    for (let booking of bookings) {
        // skip to next booking if booking === editBooking
        if (booking.id === editBooking.id) {
            continue;
        }

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

    //Edit the booking if no conflicts
    editBooking.update(req.body);

    // convert newBooking to POJO to convert start and end Dates and createdAt/updatedAt formatting:
    editBooking = editBooking.toJSON();

    //converting start and end Date to yyyy-mm-dd
    let newStartDate = editBooking.startDate.toISOString().slice(0, 10);
    editBooking.startDate = newStartDate;
    let newEndDate = editBooking.endDate.toISOString().slice(0, 10);
    editBooking.endDate = newEndDate;
    //converting createdAt and updatedAT to yyyy-mm-dd hh:mm:ss
    let createdAtDate = editBooking.createdAt.toISOString().slice(0, 10);
    let createdAtTime = editBooking.createdAt.toISOString().slice(11, 19);
    editBooking.createdAt = `${createdAtDate} ${createdAtTime}`;
    let updatedAtDate = editBooking.updatedAt.toISOString().slice(0, 10);
    let updatedAtTime = editBooking.updatedAt.toISOString().slice(11, 19);
    editBooking.updatedAt = `${updatedAtDate} ${updatedAtTime}`;

    return res.json(editBooking);
});

//export the router for use in ./api/index.js
module.exports = router;
