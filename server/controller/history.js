const { History } = require('../models/history')

function Controller() {
  async function find(query) {
    try {
      let hists = await History.find(query)
      return Promise.resolve(hists)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function findById(query) {
    try {
      let hist = await History.findOne(query)
      return Promise.resolve(hist)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function save(trans) {
    try {
      let saved = await trans.save()
      return Promise.resolve(saved)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  function remove(trans, cb) {
    return Promise.reject('forbidden action')
    // History.remove(trans, function(err, deleted) {
    //   if (err) return cb(err)
    //   cb(null, deleted)
    // })
  }
  function update(historyId, updatedData, cb) {
    return Promise.reject('forbidden action')
    // History.update(historyId, {$set: updatedData}, function(err, updated) {
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
