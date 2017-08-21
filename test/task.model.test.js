import mongoose from 'mongoose'
import { expect } from 'chai'

import config from '../src/config'
import db from '../src/models'

mongoose.connect(config.MONGO_URI, { useMongoClient: true })

describe("TASK MODEL", () =>
{
  const dbData = {
    user: {
      email: "success@example.com",
      password: "password1010"
    },
    group: {
      title: "home"
    },
    task: {
      title: "walk the dog out",
    }
  }

  before((done) =>
  {
    const setupUser = () =>
    {
      return new Promise((resolve, reject) =>
      {
        db.User.findOneAndRemove({ email: dbData.user.email }).exec()
          .then(() => new db.User(dbData.user).save())
          .then((data) => dbData.user = data.toJSON())
          .then(resolve)
      })
    }

    const setupGroup = () =>
    {
      return new Promise((resolve, reject) =>
      {
        db.TaskGroup.findOneAndRemove({ ...dbData.group, _owner: dbData.user.id }).exec()
          .then(() => new db.TaskGroup({...dbData.group, _owner: dbData.user.id}).save())
          .then((data) => dbData.group = data.toJSON())
          .then(resolve)
      })
    }

    const removeTask = () =>
    {
      return db.TaskGroup.findOneAndRemove({ ...dbData.group, _owner: dbData.user.id }).exec()
    }

    setupUser()
      .then(setupGroup)
      .then(() => removeTask)
      .then(() => done())
  })

  after(() =>
  {
    db.User.findOneAndRemove({ email: dbData.user.email }).exec()
      .then(() => db.TaskGroup.findOneAndRemove({ id: dbData.group.id }).exec())
      .then(() => db.Task.findOneAndRemove({ id: dbData.task.id }).exec())
      // .then(mongoose.connection.close())
  })

  describe("DATABASE", () =>
  {
    it("should save new task document", (done) =>
    {
      const task = new db.Task({...dbData.task, _owner: dbData.user.id})
      task.save()
        .then((data) =>
      {
        dbData.task = data.toJSON()
        expect(data).to.have.property('status')
        expect(data).to.have.property('_groups')
        expect(data).to.have.property('_owner')
        done()
      })
        .catch(console.log)
    })

    describe("queries and statics", () =>
    {
      it("should fail while, looking for a task (valid task id + invalid user id)", (done) =>
      {
        db.Task.findOne({ id: dbData.task.id, _owner: "wrong id" }).exec()
          .catch((err) =>
        {
          expect(err).to.exist
          expect(err.message).to.equal(`Cast to ObjectId failed for value "wrong id" at path "_owner" for model "Task"`)
          done()
        })
      })

      it("should find list of user's tasks", (done) =>
      {
        db.Task.find({ _owner: dbData.user.id }).exec()
          .then((data) => data.map((t) => t.toJSON()))
          .then((data) =>
        {
          expect(data).to.be.an.instanceof(Array)
          const taskIds = data.map((t) => t.id)
          expect(taskIds).to.have.members([dbData.task.id])
          done()
        })
          .catch(console.error)
      })
    })

    describe("VALIDATION", () =>
    {
      describe("title", () =>
      {
        it("should return an error (missing title)", (done) =>
        {
          const task = new db.Task({_owner: dbData.user.id})
          task.validate((err) =>
          {
            expect(err.errors.title).to.exist
            done()
          })
        })
      })

      describe("owner", () =>
      {
        it("should return an error (missing _owner)", (done) =>
        {
          const task = new db.Task({...dbData.task})
          task.validate((err) =>
          {
            expect(err.errors._owner).to.exist
            done()
          })
        })

        it("should return an error (invalid _owner format)", (done) =>
        {
          const task = new db.Task({...dbData.task, _owner: '123'})
          task.validate((err) =>
          {
            expect(err.errors._owner).to.exist
            done()
          })
        })
      })

      describe("groups", () =>
      {
        it("should return an error (invalid _groups format)", (done) =>
        {
          const task = new db.Task({...dbData.task, _owner: dbData.user.id, _groups: ['123']})
          task.validate((err) =>
          {
            expect(err.errors._groups).to.exist
            done()
          })
        })
      })
    })
  })
})
