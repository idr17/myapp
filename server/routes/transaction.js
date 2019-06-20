const express = require('express')
const router = express.Router()
const { Transaction } = require('../models/transaction')
const { auth } = require('../middleware/auth')
const transactionController = require('../controller/transaction')
const userController = require('../controller/user')
const config = require('../config/properties')

router.get('/', (req, res) => {
  transactionController.findTransaction({}, function(err, trans) {
    if (err) return res.status(400).send(err)
    res.status(200).send(trans)
  })
})

router.get('/:id', (req, res) => {
  transactionController.findTransactionById({_id: req.params.id}, function(err, trans) {
    if (err) return res.status(400).send(err)
    res.status(200).send(trans)
  })
})

router.post('/', auth, (req, res) => {

  userController.findUserById({_id: req.body.to}, function(err, user) {
    if (err) return res.status(400).send(err)

    userController.findUserById({_id: req.body.from}, function(err, userFrom) {
      if (err) return res.status(400).send(err)
      
      let theBalance = 0
      if (req.body.type === config.TRANSACTION_TYPE.DB) {
        theBalance = user.balance
      } else if (req.body.type === config.TRANSACTION_TYPE.TRANSFER) {
        theBalance = userFrom.balance
      }

      if (user.balance > req.body.amount || req.body.type === config.TRANSACTION_TYPE.CR) {

        const transaction = new Transaction({
          type: req.body.type,
          amount: req.body.amount,
          fromAccId: req.body.from,
          toAccId: req.body.to
        })
    
        transactionController.saveTransaction(transaction, (err, saved) => {
    
          if (err) return res.status(400).send(err)
      
          // update balance
          let updatedData = {
            email: user.email,
            password: user.password,
            balance: user.balance
          }
    
          if (saved.type === config.TRANSACTION_TYPE.DB) {
            updatedData.balance = updatedData.balance - saved.amount
            userController.updateUser({_id: user._id}, updatedData, (err, updated) => {
              if (err) return res.status(400).send(err)
              res.status(200).send('successfully updated')
            })
          } else if (saved.type === config.TRANSACTION_TYPE.CR) {
            updatedData.balance = updatedData.balance + saved.amount
            userController.updateUser({_id: user._id}, updatedData, (err, updated) => {
              if (err) return res.status(400).send(err)
              res.status(200).send('successfully updated')
            })
          } else if (saved.type === config.TRANSACTION_TYPE.TRANSFER) {
    
            updatedData.balance = updatedData.balance + saved.amount
            userController.updateUser({_id: req.body.to}, updatedData, (err, updated) => {
            if (err) return res.status(400).send(err)
              
              let transferFromUser = {
                email: userFrom.email,
                password: userFrom.password,
                balance: userFrom.balance - saved.amount
              }
    
              userController.updateUser({_id: req.body.from}, transferFromUser, (err, updated) => {
                if (err) return res.status(400).send(err)
                res.status(200).send('successfully updated')              
              })
            })
    
          } else return res.status(400).json({"message": "invalid transaction type"})
    
        })
      } else {
        return res.status(400).json({"message": "lack of balance"}) 
      }
    })
  })
})

// router.delete('/:id', auth, (req, res) => {
router.delete('/:id', auth, (req, res) => {
  transactionController.removeTransaction({_id: req.params.id}, (err, deleted) => {
    if (err) return res.status(400).send(err)
    res.status(200).send(`${req.params.id} successfully deleted`)
  })
})

// router.put('/:id', auth, (req, res) => {
router.put('/:id', auth, (req, res) => {
  let updatedData = {
    type: req.body.type,
    amount: req.body.amount,
    fromAccId: req.body.from,
    toAccId: req.body.to
  }

  transactionController.updateTransaction({_id: req.params.id}, updatedData, (err, updated) => {
    if (err) return res.status(400).send(err)
    res.status(200).send(`${req.params.id} successfully updated`)
  })
})

module.exports = router
