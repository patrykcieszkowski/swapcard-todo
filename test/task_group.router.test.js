import { expect } from 'chai'
import supertest from 'supertest'

import { verifyJWTToken } from '../src/libs/auth'
import config from '../src/config'

const api = supertest(`http://localhost:${config.PORT}`)

describe("TASK_GROUP ROUTER", () =>
{
  const dbData = {
    user: {
      data: {
        email: "success@example.com",
        password: "password1010"
      }
    },
    group: {
      data: {
        title: "home"
      }
    }
  }

  before((done) =>
  {
    api.post(`/auth/signup`).send(dbData.user.data)
      .then((res) => dbData.user.token = res.body.token)
      .then((token) => dbData.user.result = verifyJWTToken(token))
      .then(() => done())
  })

  after(() =>
  {
    api.delete(`/auth`).set("x-access-token", dbData.user.token)
  })

  describe("TOKEN MIDDLEWARE", () =>
  {
    it("should fail (missing token)", (done) =>
    {
      api.post(`/group`)
        .send(dbData.group.data)
        .expect(400)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("message")
        expect(res.body).to.have.not.property("success")
        expect(res.body).to.have.not.property("result")
        done()
      })
    })
  })

  describe("POST", () =>
  {
    it("should fail (missing title)", (done) =>
    {
      api.post(`/group`)
        .send({})
        .set("x-access-token", dbData.user.token)
        .expect(400)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("message")
        expect(res.body).to.have.not.property("success")
        expect(res.body).to.have.not.property("result")
        done()
      })
    })

    it("should create new group", (done) =>
    {
      api.post(`/group`)
        .send(dbData.group.data)
        .set("x-access-token", dbData.user.token)
        .expect(201)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.property("result")
        expect(res.body).to.have.not.property("message")
        expect(res.body.result.title).to.be.equal(dbData.group.data.title)

        dbData.group.result = res.body.result
        done()
      })
    })
  })

  describe("PUT", () =>
  {
    it("should fail (missing body data)", (done) =>
    {
      api.put(`/group/${dbData.group.result.id}`)
        .set("x-access-token", dbData.user.token)
        .expect(400)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("message")
        expect(res.body).to.have.not.property("success")
        expect(res.body).to.have.not.property("result")
        done()
      })
    })

    it("should sucesfully update result", (done) =>
    {
      api.put(`/group/${dbData.group.result.id}`)
        .send({ title: "test" })
        .set("x-access-token", dbData.user.token)
        .expect(200)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.property("result")
        expect(res.body).to.have.not.property("message")
        expect(res.body.result.title).to.equal("test")
        done()
      })
    })
  })

  describe("GET", () =>
  {
    it("should return list of user's groups", (done) =>
    {
      api.get(`/group`)
        .set("x-access-token", dbData.user.token)
        .expect(200)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.property("result")
        expect(res.body).to.have.not.property("message")

        const groupIds = res.body.result.map((t) => t.id)
        expect(groupIds).to.have.members([dbData.group.result.id])
        done()
      })
    })
  })

  describe("DELETE", () =>
  {
    it("should remove targeted group", (done) =>
    {
      api.delete(`/group/${dbData.group.result.id}`)
        .set("x-access-token", dbData.user.token)
        .expect(200)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.not.property("result")
        expect(res.body).to.have.not.property("message")
        done()
      })
    })
  })
})
