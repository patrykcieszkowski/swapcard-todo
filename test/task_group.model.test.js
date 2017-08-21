import mongoose from 'mongoose'
import { expect } from 'chai'

import config from '../src/config'
import db from '../src/models'

mongoose.connect(config.MONGO_URI, { useMongoClient: true })

describe("TASK_GROUP MODEL", () =>
{
  const dbData = {
    user: {
      email: "success@example.com",
      password: "password1010"
    },
    group: {
      title: "home"
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

    const removeGroup = () =>
    {
      return new Promise((resolve, reject) =>
      {
        db.TaskGroup.findOneAndRemove({ ...dbData.group, _owner: dbData.user.id }).exec()
          .then(() => new db.TaskGroup({...dbData.group, _owner: dbData.user.id}).save())
          .then((data) => dbData.group = data.toJSON())
          .then(resolve)
      })
    }

    setupUser()
      .then(() => db.TaskGroup.findOneAndRemove({ ...dbData.group, _owner: dbData.user.id }).exec())
      .then(() => done())
  })

  after(() =>
  {
    db.User.findOneAndRemove({ email: dbData.user.email }).exec()
      .then(() => db.TaskGroup.findOneAndRemove({ id: dbData.group.id }).exec())
      // .then(mongoose.connection.close())
  })

  describe("DATABASE", () =>
  {
    it("should save new task document", (done) =>
    {
      const group = new db.TaskGroup({...dbData.group, _owner: dbData.user.id})

      group.save()
        .then((data) =>
      {
        dbData.group = data.toJSON()
        expect(data).to.have.property("title")
        expect(data).to.have.property("_owner")
        expect(data).to.have.property("createdAt")
        expect(data).to.have.property("updatedAt")
        done()
      })
        .catch(console.error)
    })
  })

  describe("queries and statics", () =>
  {
    it("should fail while, looking for a groups (valid group id + invalid user id)", (done) =>
    {
      db.TaskGroup.findOne({ id: dbData.group.id, _owner: "wrong id" }).exec()
        .catch((err) =>
      {
        expect(err).to.exist
        expect(err.message).to.equal(`Cast to ObjectId failed for value "wrong id" at path "_owner" for model "TaskGroup"`)
        done()
      })
    })

    it("should find list of user's groups", (done) =>
    {
      db.TaskGroup.find({ _owner: dbData.user.id }).exec()
        .then((data) => data.map((g) => g.toJSON()))
        .then((data) =>
      {
        expect(data).to.be.an.instanceof(Array)
        const groupIds = data.map((g) => g.id)
        expect(groupIds).to.have.members([dbData.group.id])
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
        const task = new db.TaskGroup({_owner: dbData.user.id})
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
        const task = new db.TaskGroup({...dbData.group})
        task.validate((err) =>
        {
          expect(err.errors._owner).to.exist
          done()
        })
      })

      it("should return an error (invalid _owner format)", (done) =>
      {
        const task = new db.TaskGroup({...dbData.group, _owner: "123"})
        task.validate((err) =>
        {
          expect(err.errors._owner).to.exist
          done()
        })
      })
    })
  })
})
