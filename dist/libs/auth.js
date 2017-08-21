'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.verifyJWTToken = verifyJWTToken;
exports.createJWToken = createJWToken;

var _jsonwebtoken = require('jsonwebtoken');

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _config = require('../config');

var _config2 = _interopRequireDefault(_config);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function verifyJWTToken(token) {
  return _jsonwebtoken2.default.verify(token, _config2.default.JWT_SECRET);
}

function createJWToken(details) {
  var token = _jsonwebtoken2.default.sign(details.data, _config2.default.JWT_SECRET, {
    expiresIn: details.maxAge,
    algorithm: 'HS256'
  });

  return token;
}