'use strict';

var express = require('express');

var router = express.Router();

var test = require('../libs/test');

router.get('/', function (req, res) {
  console.log(test.concat(2, 2));
  console.log(test.concat("b", "a"));
  res.status(200).json({ hello: 'world' });
});

module.exports = router;