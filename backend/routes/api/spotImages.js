//Feature 3: Set up the router
const express = require('express');

const router = express.Router();

const { Booking, Spot, SpotImage, Review, ReviewImage, User, sequelize } = require('../../db/models');
const { requireAuth } = require('../../utils/auth');

//export the router for use in ./api/index.js
module.exports = router;
