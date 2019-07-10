const express = require('express')
const router = express.Router()
const { Transaction } = require('../models/transaction')
const { History } = require('../models/history')
const { auth } = require('../middleware/auth')
const transactionController = require('../controller/transaction')
const userController = require('../controller/user')
const historyController = require('../controller/history')
const config = require('../config/properties')

router.get('/', async (req, res) => {
  try {
    let trans = await transactionController.find({})
    res.status(200).send(trans)
  } catch(err) {
    res.status(400).json({error: err})
  }
})

router.get('/:id', async (req, res) => {
  try {
    let trans = await transactionController.findById({_id: req.params.id})
    res.status(200).send(trans)
  } catch(err) {
    res.status(400).json({error: err})
  }
})

router.post('/', auth, async (req, res) => {

  try {

    // Type checking
    if (req.body.type !== config.TRANSACTION_TYPE.DB && req.body.type !== config.TRANSACTION_TYPE.TRANSFER && req.body.type !== config.TRANSACTION_TYPE.CR) {
      res.status(400).send('Invalid transaction type')
    }
    
    let accountFrom = await userController.findAccountById({_id: req.body.from})

    // Balance checking
    if (accountFrom.balance > req.body.amount || req.body.type === config.TRANSACTION_TYPE.CR) {

      // create transaction
      const transaction = new Transaction({
        type: req.body.type,
        amount: req.body.amount,
        fromAccId: req.body.from,
        toAccId: req.body.to
      })

      let saved = await transactionController.save(transaction)

      let updatedData = {
        email: accountFrom.email,
        // password: accountFrom.password,
        balance: accountFrom.balance,
        token: accountFrom.token
      }

      // Update user and create history for each transaction
      if (saved.type === config.TRANSACTION_TYPE.CR || saved.type === config.TRANSACTION_TYPE.DB) {
        
        if (saved.type === config.TRANSACTION_TYPE.CR) {
          updatedData.balance += saved.amount
        } else if (saved.type === config.TRANSACTION_TYPE.DB) {
          updatedData.balance -= saved.amount
        }
  
        await userController.update({_id: accountFrom._id}, updatedData)
  
        let history = new History({
          transactionId: saved._id,
          accId: req.body.from,
          balance: updatedData.balance
        })
      
        await historyController.save(history)
        res.status(200).send('transaction successfully')

      } else if (saved.type === config.TRANSACTION_TYPE.TRANSFER) {

        // The difference between TRANSFER and other transaction is,
        // TRANSFER need to patch/update both sender and receiver balance
        // and need to create history for both also
        
        let accountTo = await userController.findAccountById({_id: req.body.to})
        
        let userUpdatedData1 = {
          email: accountFrom.email,
          // password: accountFrom.password,
          balance: accountFrom.balance - saved.amount,
          token: accountFrom.token
        }
        
        let userUpdatedData2 = {
          email: accountTo.email,
          // password: accountTo.password,
          balance: accountTo.balance + saved.amount,
          token: accountTo.token
        }

        let history1 = new History({
          transactionId: saved._id,
          accId: req.body.from,
          balance: userUpdatedData1.balance
        })

        let history2 = new History({
          transactionId: saved._id,
          accId: req.body.to,
          balance: userUpdatedData2.balance
        })

        let userFromUpdated = userController.update({_id: accountFrom._id}, userUpdatedData1)
        let userToUpdated = userController.update({_id: accountTo._id}, userUpdatedData2)
        let createHistory1 = historyController.save(history1)
        let createHistory2 = historyController.save(history2)
        
        await Promise.all([userFromUpdated, userToUpdated, createHistory1, createHistory2])
        
        res.status(200).send('transaction successfully')

      }
      
    } else {
      return res.status(400).send("failed, lack of money") 
    }

  } catch(err) {
    res.status(400).json({error: err})
  }

})

router.delete('/:id', auth, async (req, res) => {
  try{
    let removed = await transactionController.remove({_id: req.params.id})
    res.status(200).send(removed)
  }
  catch(err) {
    res.status(400).json({error: err})
  }
})

router.put('/:id', auth, async (req, res) => {
  try {
    let updatedData = {
      type: req.body.type,
      amount: req.body.amount,
      fromAccId: req.body.from,
      toAccId: req.body.to
    }
    await transactionController.update({_id: req.params.id}, updatedData)
    res.status(200).send(removed)
  }
  catch(err) {
    res.status(400).json({error: err})
  }
})

module.exports = router
