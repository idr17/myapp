const express = require('express')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const config = require('./config/properties')
const database = require('./config/database');

const app = express()
database()

app.use(bodyParser.json())
app.use(cookieParser())

const usersRouter = require('./routes/user')
const transactionRouter = require('./routes/transaction')
const historyRouter = require('./routes/history')
app.use('/api/user', usersRouter)
app.use('/api/transaction', transactionRouter)
app.use('/api/history', historyRouter)

app.listen(config.PORT, () => {
  console.log(`Started on port ${config.PORT}`)
})
