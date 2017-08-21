/* @flow */

import mongoose, { Schema } from 'mongoose'
import { isEmail } from 'validator'
import bcrypt from 'bcrypt'

mongoose.Promise = global.Promise

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    validate: {
      isAsync: true,
      validator: isEmail,
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
    transform: (doc: any, ret: any): void =>
    {
      ret.id = ret._id
      delete ret._id
      delete ret.__v
    }
  }
})

userSchema.pre('save', function(next: Function): void
{
  const _user: any = this

  if (_user.isModified('password'))
  {
    bcrypt.hash(_user.password, 10, (err: string, hash: string): void =>
    {
      _user.password = hash
      next()
    })
  }
  else
  {
    next()
  }
})

userSchema.post('save', function(err: any, doc: any, next: Function): void
{
  if (err.name === 'MongoError' && err.code === 11000)
  {
    next(new Error("Provided email is already in use."))
  }
  else if (err.errors)
  {
    const firstErrKey: string = Object.keys(err.errors)[0]
    next(new Error(err.errors[firstErrKey].message))
  }

  next(err)
})

userSchema.methods.comparePassword = function(password: string): object
{
  const _user: any = this
  return new Promise((resolve: Function, reject: Function): void =>
  {
    bcrypt.compare(password, this.password)
      .then((data: boolean) => (data) ? _user : Promise.reject(new Error("Invalid password.")))
      .then(resolve)
      .catch(reject)
  })
}

userSchema.methods.publicParse = function(): object
{
  const _user: any = this.toJSON()
  delete _user.password

  return _user
}

const User = mongoose.model('User', userSchema)
export default User
