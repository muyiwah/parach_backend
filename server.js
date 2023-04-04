const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const cookieParser = require('cookie-parser')
const { success, error } = require('consola')
const bodyParser = require('body-parser')
const myRoute  = require('./route/route')
require('dotenv').config()

// initialize the application
const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())

// error handling
app.use((err, req, res, next) => {
  const status = err.status || 500
  const message = err.message || 'something went wrong'
  return res.status(status).json({
    success: false,
    status,
    message,
  })
})

//connect to mongoDB
mongoose
  .connect(process.env.LOCAL_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((response) =>
    success({ message: 'Database connected successfully', badge: true }),
  )
  .catch((err) => error({ message: 'Database connection failed', badge: true }))

// api routes
app.use('/api/v1', myRoute)

// create server
port = process.env.PORT

app.listen(port, () => {
  success({ message: `server started on ${port}`, badge: true })
})
