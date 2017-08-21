import chai, { expect } from 'chai'
import supertest from 'supertest'

import { verifyJWTToken } from '../src/libs/auth'
import config from '../src/config'

const api = supertest(`http://localhost:${config.PORT}`)

describe("TASK ROUTER", () =>
{
  const dbData = {
    user: {
      data: {
        email: "success@example.com",
        password: "password1010"
      }
    },
    task: {
      data: {
        title: "walk out the dog"
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
    api.post(`/auth/signup`).send(dbData.user.data) // signup user
      .then((res) => dbData.user.token = res.body.token) // save tokens
      .then((token) => dbData.user.result = verifyJWTToken(token)) // decode token
      .then(() => api.post(`/group`).send(dbData.group.data).set("x-access-token", dbData.user.token)) // create new group
      .then((res) => dbData.group.result = res.body.result) // save group result
      .then(() => done())
  })

  after(() =>
  {
    api.delete(`/auth`).set("x-access-token", dbData.user.token)
  })

  describe("TOKEN", () =>
  {
    it("should fail (missing token)", (done) =>
    {
      api.post(`/task`)
        .send(dbData.task.data)
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
      api.post(`/task`)
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

    it("should create new task", (done) =>
    {
      api.post(`/task`)
        .send(dbData.task.data)
        .set("x-access-token", dbData.user.token)
        .expect(201)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.property("result")
        expect(res.body).to.have.not.property("message")

        dbData.task.result = res.body.result
        done()
      })
    })
  })

  describe("PUT", () =>
  {
    it("should fail (missing body data)", (done) =>
    {
      api.put(`/task/${dbData.task.result.id}`)
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
      api.put(`/task/${dbData.task.result.id}`)
        .send({ title: "test", status: 1, groups: [dbData.group.result.id] })
        .set("x-access-token", dbData.user.token)
        .expect(200)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.property("result")
        expect(res.body).to.have.not.property("message")
        expect(res.body.result.title).to.equal("test")
        expect(res.body.result._groups).to.include(dbData.group.result.id)
        done()
      })
    })
  })

  describe("GET", () =>
  {
    it("should return list of user's tasks", (done) =>
    {
      api.get(`/task`)
        .set("x-access-token", dbData.user.token)
        .expect(200)
        .then((res) =>
      {
        expect(res.body).to.be.a("object")
        expect(res.body).to.have.property("success")
        expect(res.body).to.have.property("result")
        expect(res.body).to.have.not.property("message")

        const taskIds = res.body.result.map((t) => t.id)
        expect(taskIds).to.have.members([dbData.task.result.id])

        done()
      })
    })
  })

  describe("DELETE", () =>
  {
    it("should remove targeted tasks", (done) =>
    {
      api.delete(`/task/${dbData.task.result.id}`)
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
