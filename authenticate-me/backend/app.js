// Package imports
const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const routes = require('./routes'); // Import routes from routes folder

// isProduction is true if environment is in production in the backend/config/index.js
const { environment } = require('./config');
const isProduction = environment === 'production';

// Initialize Express app
const app = express();

// Connect morgan middleware to log info about req's and res's
app.use(morgan('dev'));

// Add middleware for parsing cookies and parsing JSON bodies of reqs w/ Content-Type = "application/json"
app.use(cookieParser());
app.use(express.json());

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
  }

  // Helmet helps set a variety of headers to better secure your app
  app.use(
    helmet.crossOriginResourcePolicy({
      policy: "cross-origin"
    })
  );

  // Set the _csrf token and create req.csrfToken method
  app.use(
    csurf({
      cookie: {
        secure: isProduction,
        sameSite: isProduction && "Lax",
        httpOnly: true
      }
    })
  );

app.use(routes); // Connect all the routes

module.exports = app; // Export app for use in other files
