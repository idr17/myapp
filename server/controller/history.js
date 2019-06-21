const { History } = require('../models/history')

function Controller() {
  function find(query, cb) {
    History.find(query, function(err, histories) {
      if (err) return cb(err)
      cb(null, histories)
    })
  }
  function findById(query, cb) {
    History.findOne(query, function(err, historie) {
      if (err) return cb(err)
      cb(null, historie)
    })
  }
  function save(trans, cb) {
    trans.save(function(err, saved) {
      if (err) return cb(err)
      cb(null, saved)
    })
  }
  function remove(trans, cb) {
    History.remove(trans, function(err, deleted) {
      if (err) return cb(err)
      cb(null, deleted)
    })
  }
  function update(historyId, updatedData, cb) {
    History.update(historyId, {$set: updatedData}, function(err, updated) {
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
