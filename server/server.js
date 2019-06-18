const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/properties')
var database = require('./config/database');

const app = express()
database()

const { auth } = require('./middleware/auth')

app.use(bodyParser.json())
app.use(cookieParser())

var usersRouter = require('./routes/user')
app.use('/api/user', usersRouter)

// valid user only
app.get('/user/profile', auth, (req, res) => {  
  res.status(200).send(req.token)
})

app.listen(config.PORT, () => {
  console.log(`Started on port ${config.PORT}`)
})
