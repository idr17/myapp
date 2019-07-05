const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const config = require('../config/properties')

const defaultProject = { email: 1, balance: 1 , createdAt: 1}

function Controller() {
  function find(query, cb) {
    User.find(query, defaultProject, function(err, users) {
      if (err) return cb(err)
      cb(null, users)
    })
  }
  function findById(query, cb) {
    User.findOne(query, defaultProject, function(err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  }
  function findAccount(query, cb) {
    User.find(query, function(err, users) {
      if (err) return cb(err)
      cb(null, users)
    })
  }
  function findAccountById(query, cb) {
    User.findOne(query, function(err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  }
  function save(user, cb) {
    user.save(function(err, saved) {
      if (err) return cb(err)
      cb(null, saved)
    })
  }
  function remove(user, cb) {
    User.remove(user, function(err, deleted) {
      if (err) return cb(err)
      cb(null, deleted)
    })
  }
  function update(userId, updatedData, cb) {

    let hashPassword = updatedData.password

    bcrypt.genSalt(config.BCRYPT_SALT_I, function(err, salt) {
      if (err) return cb(err)
      bcrypt.hash(hashPassword, salt, function(err, hash) {
        if (err) return cb(err)
        updatedData.password = hash
  
        User.update(userId, {$set: updatedData}, function(err, updated) {
          if (err) return cb(err)
          cb(null, updated)
        })
      })
    })
  }
  function doLogin(loginData, cb) {
    User.findOne({'email': loginData.email}, (err, user) => {
      if (!user) return cb({message: 'Auth failed, user not found'})
  
      user.comparePassword(loginData.password, (err, isMatch) => {
        if (err) return cb(err)
        if (!isMatch) return cb({message: 'Wrong password'})
  
        // generate token after login
        user.generateToken((err, data) => {
          if (err) return cb(err)
          cb(null, data.token)
        })
      })
    })
  }
  function check(cookies, cb) {
    User.findByToken(cookies.token, (err, user) => {
      if (err) throw err
      if (!user) return res.status(401).send('no access')
      cb(null, user)
    })
  }
  return {
    find: find,
    findById: findById,
    save: save,
    remove: remove,
    update: update,
    doLogin: doLogin,
    findAccount: findAccount,
    findAccountById: findAccountById,
    check: check
  }
}

module.exports = Controller()
