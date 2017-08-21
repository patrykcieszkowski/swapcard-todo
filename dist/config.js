'use strict';

require('dotenv').config({ silent: true });

var config = {
  PORT: process.env.PORT,
  MONGO_URI: process.env.MONGO_URI
};

module.exports = config;