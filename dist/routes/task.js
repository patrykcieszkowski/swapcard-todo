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

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.all('*', (0, _middlewares.paramCheck)(['x-access-token:headers']));
router.all('*', _middlewares.verifyJWT);

router.get('/', function (req, res) {
  var user = req.user;

  _models2.default.Task.find({ _owner: user.id }).exec().then(function (data) {
    return data.map(function (t) {
      return t.toJSON();
    });
  }).then(function (data) {
    // gather all the assigned group ids
    var groupIds = [].concat.apply([], data.map(function (a) {
      return a._groups;
    }));
    return new _promise2.default(function (resolve, reject) {
      // fetch for groups
      _models2.default.TaskGroup.find({ _id: groupIds }).exec().then(function (groups) {
        return groups.map(function (a) {
          return a.toJSON();
        });
      }).then(function (groups) {
        data.map(function (task) {
          // assign valid group objects to tasks
          task._groups = task._groups.map(function (group) {
            return groups.find(function (g) {
              return g.id === group;
            });
          }).filter(function (g) {
            return g;
          }); // filter out undefined

          return task;
        });
        resolve(data);
      }).catch(reject);
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


  var task = new _models2.default.Task({
    title: title,
    _owner: user.id,
    _groups: []
  });

  task.save().then(function (data) {
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

router.delete('/:taskId', function (req, res) {
  var user = req.user;
  var taskId = req.params.taskId;


  _models2.default.Task.deleteOne({ _id: taskId, _owner: user.id }).then(function () {
    res.status(200).json({
      success: true
    });
  }).catch(function (err) {
    res.status(400).json({
      message: err.toString()
    });
  });
});

router.put('/:taskId', (0, _middlewares.paramCheck)(['title:body', 'status:body', 'groups:body']));
router.put('/:taskId', function (req, res) {
  var user = req.user;
  var _req$body = req.body,
      title = _req$body.title,
      status = _req$body.status,
      groups = _req$body.groups;
  var taskId = req.params.taskId;


  _models2.default.Task.findOneAndUpdate({ _id: taskId, _owner: user.id }, { $set: { title: title, status: status, _groups: groups, updatedAt: Date.now() } }, { new: true }).exec().then(function (data) {
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