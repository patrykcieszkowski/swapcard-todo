/* @flow */

import jwt from 'jsonwebtoken'

import config from '../config'

export function verifyJWTToken(token: string): object
{
  return jwt.verify(token, config.JWT_SECRET)
}

export function createJWToken(details: { data: any, maxAge: number }): string
{
  const token = jwt.sign(
    details.data,
    config.JWT_SECRET,
    {
      expiresIn: details.maxAge,
      algorithm: 'HS256'
    }
  )

  return token
}
