const mongoose = require('mongoose')

const historySchema = mongoose.Schema({
  transactionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Transaction' },
  balance: {
    type: Number,
    required: true
  },
  accId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, required: true, default: Date.now }
})

const History = mongoose.model('History', historySchema)

module.exports = { History }
