//Feature 1: Set up the router
const express = require('express');

const router = express.Router();

// GET /api/spots: Get all Spots
router.get('/', async(req, res) => {

});


//export the router for use in ./api/index.js
module.exports = router;
