'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _promise = require('babel-runtime/core-js/promise');

var _promise2 = _interopRequireDefault(_promise);

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _validator = require('validator');

var _bcrypt = require('bcrypt');

var _bcrypt2 = _interopRequireDefault(_bcrypt);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var userSchema = new _mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    validate: {
      isAsync: true,
      validator: _validator.isEmail,
      message: "Invalid email format."
    }
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "password needs to be at least 8 characters long."]
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: {
    transform: function transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    }
  }
});

userSchema.pre('save', function (next) {
  var _user = this;

  if (_user.isModified('password')) {
    _bcrypt2.default.hash(_user.password, 10, function (err, hash) {
      _user.password = hash;
      next();
    });
  } else {
    next();
  }
});

userSchema.post('save', function (err, doc, next) {
  if (err.name === 'MongoError' && err.code === 11000) {
    next(new Error("Provided email is already in use."));
  } else if (err.errors) {
    var firstErrKey = (0, _keys2.default)(err.errors)[0];
    next(new Error(err.errors[firstErrKey].message));
  }

  next(err);
});

userSchema.methods.comparePassword = function (password) {
  var _this = this;

  var _user = this;
  return new _promise2.default(function (resolve, reject) {
    _bcrypt2.default.compare(password, _this.password).then(function (data) {
      return data ? _user : _promise2.default.reject(new Error("Invalid password."));
    }).then(resolve).catch(reject);
  });
};

userSchema.methods.publicParse = function () {
  var _user = this.toJSON();
  delete _user.password;

  return _user;
};

var User = _mongoose2.default.model('User', userSchema);
exports.default = User;