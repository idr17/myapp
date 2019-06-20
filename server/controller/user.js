const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const config = require('../config/properties')

function Controller() {
  function findUsers(query, cb) {
    User.find(query, function(err, users) {
      if (err) return cb(err)
      cb(null, users)
    })
  }
  function findUserById(query, cb) {
    User.findOne(query, function(err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  }
  function saveUser(user, cb) {
    user.save(function(err, saved) {
      if (err) return cb(err)
      cb(null, saved)
    })
  }
  function removeUser(user, cb) {
    User.remove(user, function(err, deleted) {
      if (err) return cb(err)
      cb(null, deleted)
    })
  }
  function updateUser(userId, updatedData, cb) {

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
  return {
    findUsers: findUsers,
    findUserById: findUserById,
    saveUser: saveUser,
    removeUser: removeUser,
    updateUser: updateUser,
    doLogin: doLogin
  }
}

module.exports = Controller()
