'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseIdValidator = require('mongoose-id-validator');

var _mongooseIdValidator2 = _interopRequireDefault(_mongooseIdValidator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongoose2.default.Promise = global.Promise;

var taskGroupSchema = new _mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  _owner: {
    type: _mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
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
      ret.id = ret._id.toString();
      delete ret._id;
      delete ret._owner;
      delete ret.__v;
    }
  }
});

taskGroupSchema.plugin(_mongooseIdValidator2.default);

var TaskGroup = _mongoose2.default.model('TaskGroup', taskGroupSchema);
exports.default = TaskGroup;