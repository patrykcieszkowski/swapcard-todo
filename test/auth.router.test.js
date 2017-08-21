import mongoose from 'mongoose'
import chai, { expect } from 'chai'
import supertest from 'supertest'

import config from '../src/config'
import db from '../src/models'

const api = supertest(`http://localhost:${config.PORT}`)

mongoose.connect(config.MONGO_URI, { useMongoClient: true })

describe("AUTH ROUTER", () =>
{
  const dbData = {
    user: {
      data: {
        email: "success@example.com",
        password: "password1010"
      }
    }
  }

  before((done) =>
  {
    db.User.findOneAndRemove({ email: dbData.user.data.email }).exec()
      .then(done)
  })

  describe("SIGNUP", () =>
  {
    it("should fail (missing email)", (done) =>
    {
      api.post(`/auth/signup`)
        .send({ password: dbData.user.data.password })
        .expect(400)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("message")
        expect(res.body).to.have.not.property("success")
        expect(res.body).to.have.not.property("token")
        done()
      })
    })

    it("should fail (missing password)", (done) =>
    {
      api.post(`/auth/signup`)
        .send({ email: dbData.user.data.email })
        .expect(400)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("message")
        expect(res.body).to.have.not.property("success")
        expect(res.body).to.have.not.property("token")
        done()
      })
    })

    it("should sucesfully signup new user", (done) =>
    {
      api.post(`/auth/signup`)
        .send(dbData.user.data)
        .expect(201)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.property("token")
        done()
      })
        .catch(console.error)
    })
  })

  describe("LOGIN", () =>
  {
    it("should fail (missing email)", (done) =>
    {
      api.post(`/auth/login`)
        .send({ password: dbData.user.data.password })
        .expect(400)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("message")
        expect(res.body).to.have.not.property("success")
        expect(res.body).to.have.not.property("token")
        done()
      })
    })

    it("should fail (missing password)", (done) =>
    {
      api.post(`/auth/login`)
        .send({ email: dbData.user.data.email })
        .expect(400)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("message")
        expect(res.body).to.have.not.property("success")
        expect(res.body).to.have.not.property("token")
        done()
      })
    })

    it("should authenticate user", (done) =>
    {
      api.post(`/auth/login`)
        .send(dbData.user.data)
        .expect(200)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.property("token")

        dbData.user.token = res.body.token
        done()
      })
    })
  })

  describe("DELETE", () =>
  {
    it("should remove user", (done) =>
    {
      api.delete(`/auth`)
        .set("x-access-token", dbData.user.token)
        .expect(200)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.not.property("token")
        done()
      })
    })

  })
})
