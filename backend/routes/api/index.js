const router = require("express").Router();
// Phase 4:
const sessionRouter = require('./session.js');
const usersRouter = require('./users.js');
const spotsRouter = require('./spots.js'); //Feature 1
const reviewsRouter = require('./reviews.js'); //Feature 2
const bookingsRouter = require('./bookings.js'); //Feature 3
const spotImagesRouter = require('./spotImages.js'); //Feature 4
const reviewImagesRouter = require('./reviewImages.js'); //Feature 4
//Phase 3:
const { restoreUser } = require("../../utils/auth.js");

// Phase 3: Connect restoreUser middleware to the API router
  // If current user session is valid, set req.user to the user in the database
  // If current user session is not valid, set req.user to null
router.use(restoreUser);

// Phase 4:
router.use('/session', sessionRouter);

router.use('/users', usersRouter);

// Feature 1: Spots
router.use('/spots', spotsRouter);

// Feature 2: Reviews
router.use('/reviews', reviewsRouter);

// Feature 3: Bookings
router.use('/bookings', bookingsRouter);

// Feature 4: SpotImages and ReviewImages
router.use('/spot-images', spotImagesRouter);
router.use('/review-images', reviewImagesRouter);

router.post('/test', (req, res) => {
  res.json({ requestBody: req.body });
});

module.exports = router;
