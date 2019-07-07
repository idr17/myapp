const { User } = require('../models/user')
const bcrypt = require('bcrypt')
const config = require('../config/properties')

const defaultProject = { email: 1, balance: 1}

function Controller() {
  async function find(query) {
    try {
      let users = await User.find(query, defaultProject)
      return Promise.resolve(users)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function findById(query) {
    try {
      let user = await User.findOne(query, defaultProject)
      return Promise.resolve(user)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function findAccount(query) {
    try {
      let users = await User.find(query)
      return Promise.resolve(users)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function findAccountById(query) {
    try {
      let user = await User.findOne(query)
      return Promise.resolve(user)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function save(user) {
    try {
      let userSaved = await user.save()
      return Promise.resolve(userSaved)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function remove(user) {
    try {
      await User.remove(user)
      return Promise.resolve()
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function update(userId, updatedData) {
    try {
      if (updatedData.password) {
        let hashPassword = updatedData.password

        let salt = await bcrypt.genSalt(config.BCRYPT_SALT_I)
        let hash = await bcrypt.hash(hashPassword, salt)
        updatedData.password = hash
      }

      return User.update(userId, {$set: updatedData})

    } catch(err) {
      return new Error(err)
    }
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
