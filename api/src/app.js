const express = require('express')
const cors = require('cors')
const filesRouter = require('./routes/files.routes')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/files', filesRouter)

app.use((err, req, res, next) => { '// eslint-disable-line no-unused-vars'
  const status = err.status || 500
  res.status(status).json({
    error: err.message || 'Internal Server Error'
  })
})

module.exports = app
