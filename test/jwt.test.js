import { expect } from 'chai'
import { verifyJWTToken, createJWToken } from '../src/libs/auth'

describe("JWT", () =>
{
  const userData = {
    data: {
      email: "success@example.com",
      id: "21212"
    }
  }

  it("should create a token", (done) =>
  {
    userData.token = createJWToken({
      data: userData.data,
      maxAge: 3600
    })

    expect(userData.token).to.be.a("string")
    done()
  })

  it("should sucessfully verify the token", (done) =>
  {
    try
    {
      const decodedToken = verifyJWTToken(userData.token)
      expect(decodedToken).to.have.property("email", userData.data.email)
      expect(decodedToken).to.have.property("id", userData.data.id)
      expect(decodedToken).not.to.have.property("password")
      done()
    }
    catch(e)
    {
      console.error(e)
    }
  })
})
