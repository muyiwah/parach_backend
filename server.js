const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const { success, error } = require('consola')
var admin = require("firebase-admin");

const bodyParser = require('body-parser')
const myRoute  = require('./route/route')
require('dotenv').config()

// initialize the application
const app = express()


var serviceAccount = require("./service_account.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

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
const db = "mongodb+srv://muyiwah457:pass@cluster0.kr7soid.mongodb.net/?retryWrites=true&w=majority";
//connect to mongoDB
mongoose
  .connect(db, {   
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

app.listen(7000, () => {
  success({ message: `server started on ${port}`, badge: true })
})
 