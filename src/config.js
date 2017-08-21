/* @flow */

require('dotenv').config({ silent: true })

const env = ((process.env: any): {[string]: string})
const config = {
  PORT: env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGO_URI: process.env.MONGO_URI
}

export default config
