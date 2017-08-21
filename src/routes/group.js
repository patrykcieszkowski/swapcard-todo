/* @flow */

import express from 'express'

import db from '../models'
import { verifyJWT, paramCheck } from '../middlewares'

const router = express.Router()

router.all('*', paramCheck(['x-access-token:headers']))
router.all('*', verifyJWT)

router.get('/', (req: express$Request, res: express$Response): void =>
{
  const user: object = req.user

  db.TaskGroup.find({ _owner: user.id }).exec()
    .then((data: Array<any>): Array<object> => data.map((a: any): object => a.toJSON()))
    .then((data: Array<object>): void =>
  {
    res.status(200).json({
      success: true,
      result: data
    })
  })
    .catch((err: any): void =>
  {
    res.status(400).json({
      message: err.toString()
    })
  })
})

router.post('/', paramCheck(['title:body']))
router.post('/', (req: express$Request, res: express$Response): void =>
{
  const user: object = req.user
  const { title } = req.body

  const group: any = new db.TaskGroup({
    title,
    _owner: user.id
  })

  group.save()
    .then((data: any): object => data.toJSON())
    .then((data: any): void =>
  {
    res.status(201).json({
      success: true,
      result: data
    })
  })
    .catch((err: any): void =>
  {
    res.status(409).json({
      message: err.toString()
    })
  })
})

router.delete('/:groupId', (req: express$Request, res: express$Response): void =>
{
  const user: object = req.user
  const { groupId } = req.params

  db.TaskGroup.deleteOne({ _id: groupId, _owner: user.id })
    .then((): void =>
  {
    res.status(200).json({
      success: true
    })
  })
    .catch((err: any): void =>
  {
    res.status(400).json({
      message: err.toString()
    })
  })
})

router.put('/:groupId', paramCheck(['title:body']))
router.put('/:groupId', (req: express$Request, res: express$Response): void =>
{
  const user: object = req.user
  const { title } = req.body
  const { groupId } = req.params

  db.TaskGroup.findOneAndUpdate(
    { _id: groupId, _owner: user.id },
    { $set: { title, updatedAt: Date.now() }},
    { new: true }
  ).exec()
    .then((data: any): void =>
  {
    res.status(200).json({
      success: true,
      result: data
    })
  })
    .catch((err: any): void =>
  {
    res.status(400).json({
      message: err.toString()
    })
  })
})

export default router
