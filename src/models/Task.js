/* @flow */

import mongoose, { Schema } from 'mongoose'
import isValidator from 'mongoose-id-validator'

mongoose.Promise = global.Promise

const taskSchema = new Schema({
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
    type: Schema.ObjectId,
    ref: 'User',
    required: true
  },
  _groups: {
    type: [{
      type: Schema.ObjectId,
      ref: 'TaskGroup',
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
    transform: function(doc: any, ret: any): void
    {
      ret.id = ret._id.toString()
      ret._groups = ret._groups.map((a) => a.toString())
      delete ret._owner
      delete ret._id
      delete ret.__v
    }
  }
})

taskSchema.plugin(isValidator)

const Task = mongoose.model('Task', taskSchema)
export default Task
