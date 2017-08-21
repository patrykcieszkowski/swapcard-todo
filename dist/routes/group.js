'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _models = require('../models');

var _models2 = _interopRequireDefault(_models);

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.all('*', (0, _middlewares.paramCheck)(['x-access-token:headers']));
router.all('*', _middlewares.verifyJWT);

router.get('/', function (req, res) {
  var user = req.user;

  _models2.default.TaskGroup.find({ _owner: user.id }).exec().then(function (data) {
    return data.map(function (a) {
      return a.toJSON();
    });
  }).then(function (data) {
    res.status(200).json({
      success: true,
      result: data
    });
  }).catch(function (err) {
    res.status(400).json({
      message: err.toString()
    });
  });
});

router.post('/', (0, _middlewares.paramCheck)(['title:body']));
router.post('/', function (req, res) {
  var user = req.user;
  var title = req.body.title;


  var group = new _models2.default.TaskGroup({
    title: title,
    _owner: user.id
  });

  group.save().then(function (data) {
    return data.toJSON();
  }).then(function (data) {
    res.status(201).json({
      success: true,
      result: data
    });
  }).catch(function (err) {
    res.status(409).json({
      message: err.toString()
    });
  });
});

router.delete('/:groupId', function (req, res) {
  var user = req.user;
  var groupId = req.params.groupId;


  _models2.default.TaskGroup.deleteOne({ _id: groupId, _owner: user.id }).then(function () {
    res.status(200).json({
      success: true
    });
  }).catch(function (err) {
    res.status(400).json({
      message: err.toString()
    });
  });
});

router.put('/:groupId', (0, _middlewares.paramCheck)(['title:body']));
router.put('/:groupId', function (req, res) {
  var user = req.user;
  var title = req.body.title;
  var groupId = req.params.groupId;


  _models2.default.TaskGroup.findOneAndUpdate({ _id: groupId, _owner: user.id }, { $set: { title: title, updatedAt: Date.now() } }, { new: true }).exec().then(function (data) {
    res.status(200).json({
      success: true,
      result: data
    });
  }).catch(function (err) {
    res.status(400).json({
      message: err.toString()
    });
  });
});

exports.default = router;