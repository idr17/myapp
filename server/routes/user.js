const express = require('express')
const router = express.Router()
const { User } = require('../models/user')
const { auth } = require('../middleware/auth')
const userController = require('../controller/user')

router.get('/account', auth, (req, res) => {
  userController.findAccount({}, function(err, users) {
    if (err) return res.status(400).send(err)
    res.status(200).send(users)
  })
})

router.get('/account/:id', auth, (req, res) => {
  userController.findAccountById({_id: req.params.id}, function(err, user) {
    if (err) return res.status(400).send(err)
    res.status(200).send(user)
  })
})

// Check user login
router.get('/check', auth, (req, res) => {
  userController.check({token: req.cookies.auth}, function(err, user) {
    if (err) return res.status(400).send(err)
    res.status(200).send(user)
  })
})

router.get('/', (req, res) => {
  userController.find({}, function(err, users) {
    if (err) return res.status(400).send(err)
    res.status(200).send(users)
  })
})

router.get('/:id', (req, res) => {
  userController.findById({_id: req.params.id}, function(err, user) {
    if (err) return res.status(400).send(err)
    res.status(200).send(user)
  })
})

router.post('/', (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  })

  userController.save(user, (err, saved) => {
    if (err) return res.status(400).send(err)
    res.status(200).send(saved)
  })
})

router.delete('/:id', auth, (req, res) => {
  userController.remove({_id: req.params.id}, (err, deleted) => {
    if (err) return res.status(400).send(err)
    res.status(200).send('delete success')
  })
})

router.put('/:id', auth, (req, res) => {

  let updatedData = {
    email: req.body.email,
    password: req.body.password
  }

  userController.update({_id: req.params.id}, updatedData, (err, updated) => {
    if (err) return res.status(400).send(err)
    res.status(200).send('update success')
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
    res.cookie('auth', token).send('Login success')
  })
})

// logout
router.get('/logout/:id', auth, (req, res) => {
  userController.check({token: req.cookies.auth}, function(err, user) {
    if (err) return res.status(400).send(err)
    if (user._id == req.params.id) {
        res.status(200).cookie('auth', '').send('logout successfully')
    } else {
      res.status(401).send('failed, logout only for current user')
    }
  })
})

module.exports = router
