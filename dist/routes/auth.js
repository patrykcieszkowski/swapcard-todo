'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _auth = require('../libs/auth');

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/login', (0, _middlewares.paramCheck)(['email:body', 'password:body']));
router.post('/login', function (req, res) {
  var _req$body = req.body,
      email = _req$body.email,
      password = _req$body.password;


  _models2.default.User.findOne({ email: email }).exec().then(function (user) {
    return user || _promise2.default.reject(new Error("User not found."));
  }).then(function (user) {
    return user.comparePassword(password);
  }).then(function (user) {
    return user.publicParse(user);
  }).then(function (user) {
    var token = (0, _auth.createJWToken)({ data: user, maxAge: 3600 });
    res.status(200).json({
      success: true,
      token: token
    });
  }).catch(function (err) {
    res.status(401).json({
      message: err.toString()
    });
  });
});

router.post('/signup', (0, _middlewares.paramCheck)(['email:body', 'password:body']));
router.post('/signup', function (req, res) {
  var _req$body2 = req.body,
      email = _req$body2.email,
      password = _req$body2.password;


  var user = _models2.default.User({
    email: email,
    password: password
  });

  user.save().then(function (user) {
    return user.publicParse(user);
  }).then(function (user) {
    var token = (0, _auth.createJWToken)({ data: user, maxAge: 3600 });
    res.status(201).json({
      success: true,
      token: token
    });
  }).catch(function (err) {
    res.status(401).json({
      message: err.toString()
    });
  });
});

router.delete('/', (0, _middlewares.paramCheck)(['x-access-token:headers']));
router.delete('/', _middlewares.verifyJWT);
router.delete('/', function (req, res) {
  var user = req.user;

  _models2.default.User.remove({ _id: user.id }).exec().then(function () {
    return _models2.default.Task.remove({ _owner: user.id }).exec();
  }).then(function () {
    return _models2.default.TaskGroup.remove({ _owner: user.id }).exec();
  }).then(function (data) {
    res.status(200).json({
      success: true
    });
  }).catch(function (err) {
    res.status(401).json({
      message: err.toString()
    });
  });
});

exports.default = router;