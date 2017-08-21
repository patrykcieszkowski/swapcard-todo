'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _auth = require('./auth');

var _auth2 = _interopRequireDefault(_auth);

var _task = require('./task');

var _task2 = _interopRequireDefault(_task);

var _group = require('./group');

var _group2 = _interopRequireDefault(_group);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  auth: _auth2.default,
  task: _task2.default,
  group: _group2.default
};