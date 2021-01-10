const morgan = require('morgan');
const { logger } = require('../configuration')
const express = require('express');
const cors = require('cors');

module.exports = {
  middleware: (app) => {
    app.use(morgan('combined', { stream: logger.stream }));
    app.use(express.json());
    // app.use(express.urlencoded());
    app.use(cors({
      // origin: process.env.REACT_APP_URI,
    }))
  },
  auth: require('./auth')
}