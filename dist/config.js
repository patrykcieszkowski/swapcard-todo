'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
require('dotenv').config({ silent: true });

var env = process.env;
var config = {
  PORT: env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI
};

exports.default = config;