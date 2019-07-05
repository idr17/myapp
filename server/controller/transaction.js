const { Transaction } = require('../models/transaction')

function Controller() {
  function find(query, cb) {
    Transaction.find(query, function(err, trans) {
      if (err) return cb(err)
      cb(null, trans)
    })
  }
  function findById(query, cb) {
    Transaction.findOne(query, function(err, trans) {
      if (err) return cb(err)
      cb(null, trans)
    })
  }
  function save(trans, cb) {
    trans.save(function(err, saved) {
      if (err) return cb(err)
      cb(null, saved)
    })
  }
  function remove(trans, cb) {
    Transaction.remove(trans, function(err, deleted) {
      if (err) return cb(err)
      cb(null, deleted)
    })
  }
  function update(transId, updatedData, cb) {
    Transaction.update(transId, {$set: updatedData}, function(err, updated) {
      if (err) return cb(err)
      cb(null, updated)
    })
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