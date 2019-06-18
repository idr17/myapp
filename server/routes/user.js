const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const config = require('../config/properties')
const { User } = require('../models/user')
const { auth } = require('../middleware/auth')

router.get('/', (req, res, next) => {
  User.find({})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})

router.get('/:id', (req, res, next) => {
  User.findOne({_id: req.params.id})
    .then(data => res.status(200).send(data))
    .catch(err => res.status(400).send(err))
})

router.post('/', (req, res) => {
  const user = new User({
    email: req.body.email,
    password: req.body.password
  })

  user.save()
  .then(data => res.status(200).send(data))
  .catch(err => res.status(400).send(err))
})

router.delete('/:id', auth, (req, res) => {
  User.remove({_id: req.params.id})
  .then(data => res.status(200).json({message: `${req.params.id} successfully deleted`}))
  .catch(err => res.status(400).send(err))
})

router.put('/:id', auth, (req, res) => {

  let hashPassword = req.body.password

  bcrypt.genSalt(config.BCRYPT_SALT_I, function(err, salt) {
    if (err) res.status(400).send(err)
    bcrypt.hash(hashPassword, salt, function(err, hash) {
      if (err) res.status(400).send(err)
      hashPassword = hash

      User.update({_id: req.params.id}, {
        $set: {
          email: req.body.email,
          password: hashPassword
        }
      })
      .then(data => res.status(200).send(data))
      .catch(err => res.status(400).send(err))

    })
  })


})

// login
router.post('/login', (req, res) => {
  User.findOne({'email': req.body.email}, (err, user) => {
    if (!user) res.json({message: 'Auth failed, user not found'})

    user.comparePassword(req.body.password, (err, isMatch) => {
      if (err) throw err
      if (!isMatch) return res.status(400).json({message: 'Wrong password'})

      // generate token after login
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err)
        res.cookie('auth', user.token).send('ok')
      })
    })
  })
})

// logout
router.get('/logout/:id', auth, (req, res) => {
  res.cookie('auth', '').send('Logout successfully')
})

module.exports = router
