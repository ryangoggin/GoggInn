// backend/routes/index.js
const express = require('express');
const router = express.Router();
const apiRouter = require('./api'); //import from index.js in api folder

// Add a XSRF-TOKEN cookie --> should not be available in production
router.get("/api/csrf/restore", (req, res) => {
    const csrfToken = req.csrfToken();
    res.cookie("XSRF-TOKEN", csrfToken);
    res.status(200).json({
      'XSRF-Token': csrfToken
    });
  });

// API router
router.use('/api', apiRouter);

module.exports = router;
