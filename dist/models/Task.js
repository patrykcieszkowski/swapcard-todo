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

var taskSchema = new _mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: false
  },
  /*
    0 - uncompleted
    1 - completed
  */
  status: {
    type: Number,
    required: true,
    default: 0
  },
  _owner: {
    type: _mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  _groups: {
    type: [{
      type: _mongoose.Schema.ObjectId,
      ref: 'TaskGroup'
    }],
    require: false
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
      ret._groups = ret._groups.map(function (a) {
        return a.toString();
      });
      delete ret._owner;
      delete ret._id;
      delete ret.__v;
    }
  }
});

taskSchema.plugin(_mongooseIdValidator2.default);

var Task = _mongoose2.default.model('Task', taskSchema);
exports.default = Task;