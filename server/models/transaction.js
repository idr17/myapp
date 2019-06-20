const mongoose = require('mongoose')

const transactionSchema = mongoose.Schema({
  type: { // type: transfer(need from & to), credit(to), debet(to)
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true,
    default: 0
  },
  fromAccId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  toAccId: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
  createdAt: { type: Date, required: true, default: Date.now }
})

const Transaction = mongoose.model('Transaction', transactionSchema)

module.exports = { Transaction }
