const express = require('express')
const router = express.Router()
const { Transaction } = require('../models/transaction')
const { History } = require('../models/history')
const { auth } = require('../middleware/auth')
const transactionController = require('../controller/transaction')
const userController = require('../controller/user')
const historyController = require('../controller/history')
const config = require('../config/properties')

router.get('/', (req, res) => {
  transactionController.find({}, function(err, trans) {
    if (err) return res.status(400).send(err)
    res.status(200).send(trans)
  })
})

router.get('/:id', (req, res) => {
  transactionController.findById({_id: req.params.id}, function(err, trans) {
    if (err) return res.status(400).send(err)
    res.status(200).send(trans)
  })
})

router.post('/', auth, (req, res) => {

  userController.findById({_id: req.body.to}, function(err, user) {
    if (err) return res.status(400).send(err)

    userController.findById({_id: req.body.from}, function(err, userFrom) {
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
    
        transactionController.save(transaction, (err, saved) => {
    
          if (err) return res.status(400).send(err)
      
          // update balance
          let updatedData = {
            email: user.email,
            password: user.password,
            balance: user.balance
          }
    
          if (saved.type === config.TRANSACTION_TYPE.DB) {
            updatedData.balance = updatedData.balance - saved.amount
            userController.update({_id: user._id}, updatedData, (err, updated) => {
              if (err) return res.status(400).send(err)

              // inject here, add to history
              let history = new History({
                transactionId: saved._id,
                accId: req.body.to,
                balance: updatedData.balance
              })
            
              historyController.save(history, (err, saved) => {
                if (err) return res.status(400).send(err)
                res.status(200).send('update success') 
              })

            })
          } else if (saved.type === config.TRANSACTION_TYPE.CR) {
            updatedData.balance = updatedData.balance + saved.amount
            userController.update({_id: user._id}, updatedData, (err, updated) => {
              if (err) return res.status(400).send(err)

                // inject here, add to history
                let history = new History({
                  transactionId: saved._id,
                  accId: req.body.to,
                  balance: updatedData.balance
                })
              
                historyController.save(history, (err, saved) => {
                  if (err) return res.status(400).send(err)
                  res.status(200).send('update success')
                })

            })
          } else if (saved.type === config.TRANSACTION_TYPE.TRANSFER) {
    
            updatedData.balance = updatedData.balance + saved.amount
            userController.update({_id: req.body.to}, updatedData, (err, updated) => {
            if (err) return res.status(400).send(err)

              // inject here, add to history
              let historyCR = new History({
                transactionId: saved._id,
                accId: req.body.to,
                balance: updatedData.balance
              })
            
              historyController.save(historyCR, (err, saved) => {
                if (err) return res.status(400).send(err)
              })

              // menambahkan ke transaction, history
              
              let transferFromUser = {
                email: userFrom.email,
                password: userFrom.password,
                balance: userFrom.balance - saved.amount
              }
    
              userController.update({_id: req.body.from}, transferFromUser, (err, updated) => {
                if (err) return res.status(400).send(err)

                let historyDB = new History({
                  transactionId: saved._id,
                  accId: req.body.from,
                  balance: transferFromUser.balance
                })
              
                historyController.save(historyDB, (err, saved) => {
                  if (err) return res.status(400).send(err)
                  res.status(200).send('update success')              
                })

              })
            })
    
          } else return res.status(400).json({"message": "invalid transaction type"})
    
        })
      } else {
        return res.status(400).json({"message": "Lack of balance"}) 
      }
    })
  })
})

router.delete('/:id', auth, (req, res) => {
  transactionController.remove({_id: req.params.id}, (err, deleted) => {
    if (err) return res.status(400).send(err)
    res.status(200).send('delete success')
  })
})

router.put('/:id', auth, (req, res) => {
  let updatedData = {
    type: req.body.type,
    amount: req.body.amount,
    fromAccId: req.body.from,
    toAccId: req.body.to
  }

  transactionController.update({_id: req.params.id}, updatedData, (err, updated) => {
    if (err) return res.status(400).send(err)
    res.status(200).send('update success')
  })
})

module.exports = router
