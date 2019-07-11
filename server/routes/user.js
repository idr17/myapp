const express = require('express')
const router = express.Router()
const { User } = require('../models/user')
const { auth } = require('../middleware/auth')
const userController = require('../controller/user')

router.get('/account', auth, async (req, res) => {
  try {
    let users = await userController.findAccount({})
    res.status(200).send(users)
  } catch(err) {
    res.status(400).json({error: err})
  }
})

router.get('/account/:id', auth, async (req, res) => {
  try {
    let user = await userController.findAccountById({_id: req.params.id})
    res.status(200).send(user)
  } catch(err) {
    res.status(400).json({error: err})
  }
})

// Check user login
router.get('/check', auth, (req, res) => {
  userController.check({token: req.cookies.auth}, function(err, user) {
    if (err) return res.status(400).json({error: err})
    res.status(200).send(user)
  })
})

router.get('/', async (req, res) => {
  try {
    let users = await userController.find({})
    res.status(200).send(users)
  } catch(err) {
    res.status(400).json({error: err})
  }
})

router.get('/:id', async (req, res) => {
  try { 
    let user = await userController.findById({_id: req.params.id})
    res.status(200).send(user)
  } catch(err) {
    res.status(400).json({error: err})
  }
})

router.post('/', async (req, res) => {
  try {
    const user = new User({
      email: req.body.email,
      password: req.body.password
    })
  
    let saved = await userController.save(user)
    res.status(200).send(saved)
  } catch(err) {
    res.status(400).json({error: err})
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await userController.remove({_id: req.params.id})
    res.status(200).send('delete success')
  } catch(err) {
    res.status(400).json({error: err})
  }
})

router.patch('/:id', auth, async (req, res) => {
  try {
    let updatedData = {
      email: req.body.email,
      password: req.body.password
    }
  
    await userController.update({_id: req.params.id}, updatedData)
    res.status(200).send('update success (note: not allowed to change balance)')
  } catch(err) {
    res.status(400).json({error: err})
  }
})

// login
router.post('/login', (req, res) => {

  let loginData = {
    email: req.body.email,
    password: req.body.password
  }

  userController.doLogin(loginData, (err, token) => {
    if (err) return res.status(400).json({error: err})
    res.cookie('auth', token).send('Login success')
  })
})

// logout
router.get('/logout/:id', auth, (req, res) => {
  userController.check({token: req.cookies.auth}, function(err, user) {
    if (err) return res.status(400).json({error: err})
    if (user._id == req.params.id) {
        res.status(200).cookie('auth', '').send('logout successfully')
    } else {
      res.status(401).send('failed, logout only for current user')
    }
  })
})

module.exports = router
