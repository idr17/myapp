const { Transaction } = require('../models/transaction')

function Controller() {
  function findTransaction(query, cb) {
    Transaction.find(query, function(err, trans) {
      if (err) return cb(err)
      cb(null, trans)
    })
  }
  function findTransactionById(query, cb) {
    Transaction.findOne(query, function(err, user) {
      if (err) return cb(err)
      cb(null, user)
    })
  }
  function saveTransaction(trans, cb) {
    trans.save(function(err, saved) {
      if (err) return cb(err)
      cb(null, saved)
    })
  }
  function removeTransaction(trans, cb) {
    Transaction.remove(trans, function(err, deleted) {
      if (err) return cb(err)
      cb(null, deleted)
    })
  }
  function updateTransaction(transId, updatedData, cb) {
    Transaction.update(transId, {$set: updatedData}, function(err, updated) {
      if (err) return cb(err)
      cb(null, updated)
    })
  }
  return {
    findTransaction: findTransaction,
    findTransactionById: findTransactionById,
    saveTransaction: saveTransaction,
    removeTransaction: removeTransaction,
    updateTransaction: updateTransaction,
  }
}

module.exports = Controller()
