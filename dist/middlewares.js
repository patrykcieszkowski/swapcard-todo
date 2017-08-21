'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

exports.paramCheck = paramCheck;
exports.verifyJWT = verifyJWT;

var _auth = require('./libs/auth');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function paramCheck(list) {
  return function (req, res, next) {
    var missingParams = list.filter(function (item) {
      // split if possible - if not, create new array
      var _item = item.includes(':') ? item.split(':') : [item, 'query'];
      return !(0, _keys2.default)(req[_item[1]]).includes(_item[0]);
    });

    if (missingParams.length > 0) {
      return res.status(400).json({
        message: 'Missing arguments (' + missingParams[0] + ')'
      });
    }

    next();
  };
}

function verifyJWT(req, res, next) {
  try {
    var token = req.headers['x-access-token'];
    req.user = (0, _auth.verifyJWTToken)(token);
    next();
  } catch (e) {
    res.status(401).json({
      message: "Invalid access token provided."
    });
  }
}

exports.default = {
  paramCheck: paramCheck,
  verifyJWT: verifyJWT
};