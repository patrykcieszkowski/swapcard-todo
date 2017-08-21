/* @flow */

import mongoose, { Schema } from 'mongoose'
import isValidator from 'mongoose-id-validator'

mongoose.Promise = global.Promise

const taskGroupSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  _owner: {
    type: Schema.ObjectId,
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
    transform: function(doc: any, ret: any): void
    {
      ret.id = ret._id.toString()
      delete ret._id
      delete ret._owner
      delete ret.__v
    }
  }
})

taskGroupSchema.plugin(isValidator)

const TaskGroup = mongoose.model('TaskGroup', taskGroupSchema)
export default TaskGroup
