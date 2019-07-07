const { Transaction } = require('../models/transaction')

function Controller() {
  async function find(query) {
    try {
      let trans = await Transaction.find(query)
      return Promise.resolve(trans)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function findById(query, cb) {
    try {
      let trans = await Transaction.findOne(query)
      return Promise.resolve(trans)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function save(trans) {
    try {
      let transaction = await trans.save()
      return Promise.resolve(transaction)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  function remove(trans, cb) {
    return Promise.reject('forbidden action')
    // Transaction.remove(trans, function(err, deleted) {
    //   if (err) return cb(err)
    //   cb(null, deleted)
    // })
  }
  function update(transId, updatedData, cb) {
    return Promise.reject('forbidden action')
    // Transaction.update(transId, {$set: updatedData}, function(err, updated) {
    //   if (err) return cb(err)
    //   cb(null, updated)
    // })
  }
  return {
    find: find,
    findById: findById,
    save: save,
    remove: remove,
    update: update
  }
}

module.exports = Controller()
