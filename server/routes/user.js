const express = require('express')
const router = express.Router()
const { User } = require('../models/user')
const { auth } = require('../middleware/auth')
const userController = require('../controller/user')

router.get('/', (req, res) => {
  userController.findUsers({}, function(err, users) {
    if (err) return res.status(400).send(err)
    res.status(200).send(users)
  })
})

router.get('/:id', (req, res) => {
  userController.findUserById({_id: req.params.id}, function(err, user) {
    if (err) return res.status(400).send(err)
    res.status(200).send(user)
  })
})

router.post('/', (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  })

  userController.saveUser(user, (err, saved) => {
    if (err) return res.status(400).send(err)
    res.status(200).send(saved)
  })
})

router.delete('/:id', auth, (req, res) => {
  userController.removeUser({_id: req.params.id}, (err, deleted) => {
    if (err) return res.status(400).send(err)
    res.status(200).send(`${req.params.id} successfully deleted`)
  })
})

router.put('/:id', auth, (req, res) => {

  let updatedData = {
    email: req.body.email,
    password: req.body.password
  }

  userController.updateUser({_id: req.params.id}, updatedData, (err, updated) => {
    if (err) return res.status(400).send(err)
    res.status(200).send(`${req.params.id} successfully updated`)
  })
})

// login
router.post('/login', (req, res) => {

  let loginData = {
    email: req.body.email,
    password: req.body.password
  }

  userController.doLogin(loginData, (err, token) => {
    if (err) return res.status(400).send(err)
    res.cookie('auth', token).send('login successfully')
  })
})

// logout
router.get('/logout/:id', auth, (req, res) => {
  res.cookie('auth', '').send('Logout successfully')
})

module.exports = router
