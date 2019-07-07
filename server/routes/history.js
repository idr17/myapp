const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const historyController = require('../controller/history')

router.get('/', async (req, res) => {
  try {
    let hists = await historyController.find({})
    res.status(200).send(hists)
  } catch(err) {
    res.status(400).send(err)
  }
})

router.get('/:id', async (req, res) => {
  try {
    let hist = await historyController.findById({_id: req.params.id})
    res.status(200).send(hist)
  } catch(err) {
    res.status(400).send(err)
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await historyController.remove({_id: req.params.id})
    res.status(200).send()
  } catch(err) {
    res.status(400).send(err)
  }
})

module.exports = router
