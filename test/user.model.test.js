import mongoose from 'mongoose'
import { expect } from 'chai'

import config from '../src/config'
import db from '../src/models'

mongoose.connect(config.MONGO_URI, { useMongoClient: true })

describe("USER MODEL", () =>
{
  const userData = {
    valid: {
      data: {
        email: "success@example.com",
        password: "password"
      }
    },
    invalid: {
      data: {
        email: "fail@example.com",
        password: "wrong-password"
      }
    }
  }

  before((done) =>
  {
    db.User.findOneAndRemove({ email: userData.valid.data.email }).exec()
      .then(() => done())
  })

  after(() =>
  {
    db.User.remove({ _id: userData.result.id }).exec()
  })

  describe("DATABASE", () =>
  {
    describe("pre and post", () =>
    {
      it("should save a new user document and hash the password", (done) =>
      {
        const user = new db.User(userData.valid.data)
        user.save()
          .then((data) =>
          {
            userData.result = data.toJSON()
            expect(data).to.have.property("password").and.not.to.equal(userData.valid.data.password)
            done()
          })
          .catch(console.log)
      })
    })

    describe("queries and statics", () =>
    {
      it("should fail while looking for a user", (done) =>
      {
        db.User.findOne({ email: userData.invalid.data.email }).exec()
          .then((user) => (!user) ? Promise.reject({ message: "User not found." }) : user)
          .catch((err) =>
          {
            expect(err).to.have.property("message", "User not found.")
            done()
          })
      })

      it("should find a user, compare the passwords and parse the document to JSON", (done) =>
      {
        db.User.findOne({ email: userData.valid.data.email }).exec()
          .then((user) => (!user) ? Promise.reject({ message: "User not found." }) : user)
          .then((user) => user.comparePassword(userData.valid.data.password))
          .then((user) => user.publicParse(user))
          .then((user) =>
        {
          expect(user).to.have.property("email", userData.valid.data.email)
          expect(user).to.have.property("id")
          expect(user).not.to.have.property("_id")
          expect(user).not.to.have.property("password")
          done()
        })
          .catch(console.log)
      })
    })
  })

  describe("VALIDATION", () =>
  {
    describe("password", () =>
    {
      it("should return an error if password string is empty", (done) =>
      {
        const user = new db.User({ email: "success@example.com" })
        user.validate((err) =>
        {
          expect(err.errors.password).to.exist
          done()
        })
      })

      it("should return an error if password is too short", (done) =>
      {
        const user = new db.User({email: "success@example.com", password: "123"})
        user.validate((err) =>
        {
          expect(err.errors.password).to.exist
          done()
        })
      })
    })

    describe("email", () =>
    {
      it("should return an error if email format validation fails", (done) =>
      {
        const user = new db.User({email: "invalid email", password: "password"})
        user.validate((err) =>
        {
          expect(err.errors.email).to.exist
          done()
        })
      })

      it("should return an error if email string is empty", (done) =>
      {
        const user = new db.User({password: "password"})
        user.validate((err) =>
        {
          expect(err.errors.email).to.exist
          done()
        })
      })
    })
  })
})
