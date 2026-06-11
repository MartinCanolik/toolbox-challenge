require('dotenv').config()

const config = {
  externalApi: {
    baseUrl: 'https://echo-serv.tbxnet.com',
    apiKey: `Bearer ${process.env.API_KEY || 'aSuperSecretKey'}`,
    timeout: 10000
  },
  port: process.env.PORT || 3001
}

module.exports = config
