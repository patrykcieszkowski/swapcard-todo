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

  db.Task.find({ _owner: user.id }).exec()
    .then((data: Array<any>): Array<object> => data.map((t) => t.toJSON()))
    .then((data) =>
  {
    // gather all the assigned group ids
    const groupIds: Array<string> = [].concat.apply([], data.map((a: object): Array<string> => a._groups))
    return new Promise((resolve: Function, reject: Function): void =>
    {
      // fetch for groups
      db.TaskGroup.find({ _id: groupIds }).exec()
        .then((groups: Array<any>): Array<object> => groups.map((a: any): object => a.toJSON()))
        .then((groups: Array<object>): void =>
      {
        data.map((task: object): object =>
        {
          // assign valid group objects to tasks
          task._groups = task._groups
            .map((group: Array<object>) => groups.find((g: object): any => g.id === group))
            .filter((g: object): object => g) // filter out undefined

          return task
        })
        resolve(data)
      })
        .catch(reject)
    })
  })
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

router.post('/', paramCheck(['title:body']))
router.post('/', (req: express$Request, res: express$Response): void =>
{
  const user: object = req.user
  const { title } = req.body

  const task = new db.Task({
    title,
    _owner: user.id,
    _groups: []
  })

  task.save()
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

router.delete('/:taskId', (req: express$Request, res: express$Response): void =>
{
  const user: object = req.user
  const { taskId } = req.params

  db.Task.deleteOne({ _id: taskId, _owner: user.id })
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

router.put('/:taskId', paramCheck(['title:body', 'status:body', 'groups:body']))
router.put('/:taskId', (req: express$Request, res: express$Response): void =>
{
  const user: object = req.user
  const { title, status, groups } = req.body
  const { taskId } = req.params

  db.Task.findOneAndUpdate({ _id: taskId, _owner: user.id },
      { $set: { title, status, _groups: groups, updatedAt: Date.now() }},
      { new: true}
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
