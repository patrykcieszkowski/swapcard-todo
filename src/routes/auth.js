/* @flow */

import express from 'express'

import db from '../models'
import { createJWToken } from '../libs/auth'
import { paramCheck, verifyJWT } from '../middlewares'

const router = express.Router()

router.post('/login', paramCheck(['email:body', 'password:body']))
router.post('/login', (req: express$Request, res: express$Response): void =>
{
  const { email, password } = req.body

  db.User.findOne({ email }).exec()
    .then((user: any): any => user || Promise.reject(new Error("User not found.")))
    .then((user: any): any => user.comparePassword(password))
    .then((user: any): object => user.publicParse(user))
    .then((user: object): void =>
  {
    const token = createJWToken({ data: user, maxAge: 3600})
    res.status(200).json({
      success: true,
      token
    })
  })
    .catch((err: any): void =>
  {
    res.status(401).json({
      message: err.toString()
    })
  })
})

router.post('/signup', paramCheck(['email:body', 'password:body']))
router.post('/signup', (req: express$Request, res: express$Response): void =>
{
  const { email, password } = req.body

  const user: any = db.User({
    email,
    password
  })

  user.save()
    .then((user: any): object => user.publicParse(user))
    .then((user: any): void =>
  {
    const token: string = createJWToken({ data: user, maxAge: 3600})
    res.status(201).json({
      success: true,
      token
    })
  })
    .catch((err: any): void =>
  {
    res.status(401).json({
      message: err.toString()
    })
  })
})

router.delete('/', paramCheck(['x-access-token:headers']))
router.delete('/', verifyJWT)
router.delete('/', (req: express$Request, res: express$Response): void =>
{
  const user: object = req.user

  db.User.remove({ _id: user.id }).exec()
    .then(() => db.Task.remove({ _owner: user.id }).exec())
    .then(() => db.TaskGroup.remove({ _owner: user.id }).exec())
    .then((data: any) =>
  {
    res.status(200).json({
      success: true
    })
  })
    .catch((err: any): void =>
  {
    res.status(401).json({
      message: err.toString()
    })
  })
})

export default router
