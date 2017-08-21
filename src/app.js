/* @flow */

import http from 'http'
import express from 'express'
import mongoose from 'mongoose'
import bodyParser from 'body-parser'

import config from './config'
import routes from './routes'

mongoose.connect(process.env.MONGO_URI, { useMongoClient: true })

const app = express()
const server = http.createServer(app)

app.use(bodyParser.urlencoded())
app.use(bodyParser.json())

app.use('/auth', routes.auth)
app.use('/task', routes.task)
app.use('/group', routes.group)

server.listen(config.PORT, (): void =>
{
  console.log(`PORT: ${config.PORT}`)
})
