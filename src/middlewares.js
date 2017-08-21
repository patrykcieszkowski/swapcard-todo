import { verifyJWTToken } from './libs/auth'
import type { $Request, $Response } from 'express'

export function paramCheck(list: Array<string>): mixed
{
  return (req: $Request, res: $Response, next: Function): mixed =>
  {
    const missingParams = list.filter((item: string): object =>
    {
      // split if possible - if not, create new array
      const _item: Array<string> = (item.includes(':')) ? item.split(':') : [item, 'query']
      return (!Object.keys(req[_item[1]]).includes(_item[0]))
    })

    if (missingParams.length > 0)
    {
      return res.status(400).json({
        message: `Missing arguments (${missingParams[0]})`
      })
    }

    next()
  }
}

export function verifyJWT(req: $Request, res: $Response, next: Function): void
{
  try
  {
    const token = req.headers['x-access-token']
    req.user = verifyJWTToken(token)
    next()
  }
  catch(e)
  {
    res.status(401).json({
      message: "Invalid access token provided."
    })
  }
}

export default {
  paramCheck,
  verifyJWT
}
