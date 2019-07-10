const { History } = require('../models/history')
const userController = require('../controller/user')
const moment = require('moment')

function Controller() {
  async function find(query) {
    try {
      let hists = await History.find(query)
      return Promise.resolve(hists)
    } catch(err) {
      return Promise.reject(err)
    }
  }
  async function findByAccId(params) {
    try {
      
      if (!params.accountId) return Promise.reject('Invalid request')
      
      const current = new Date
      let startDate = params.startDate ? moment(params.startDate, 'YYYY-MM-DD') : moment(current, 'YYYY-MM-DD')
      let endDate = params.endDate ? moment(params.endDate, 'YYYY-MM-DD') : moment(current, 'YYYY-MM-DD')
      let difference = moment.duration(endDate.diff(startDate)).asDays()
      
      if (difference < 0 || difference > 7) return Promise.reject('Invalid date range, Request must be less than or within a week')
      
      let hist = await History
        .find({accId: params.accountId})
        .populate('transactionId')

      let userAccount = await userController.findById({_id: params.accountId})
      
      return Promise.resolve({user: userAccount, histories: hist})

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
    findByAccId: findByAccId,
    save: save,
    remove: remove,
    update: update
  }
}

module.exports = Controller()
