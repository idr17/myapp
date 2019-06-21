const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const historyController = require('../controller/history')

router.get('/', (req, res) => {
  historyController.find({}, function(err, histories) {
    if (err) return res.status(400).send(err)
    res.status(200).send(histories)
  })
})

router.get('/:id', (req, res) => {
  historyController.findById({_id: req.params.id}, function(err, histories) {
    if (err) return res.status(400).send(err)
    res.status(200).send(histories)
  })
})

router.delete('/:id', auth, (req, res) => {
  historyController.remove({_id: req.params.id}, (err, deleted) => {
    if (err) return res.status(400).send(err)
    res.status(200).send(`${req.params.id} successfully deleted`)
  })
})

module.exports = router
