const express = require('express')
const router = express.Router()
const { auth } = require('../middleware/auth')
const historyController = require('../controller/history')

router.get('/', auth, async (req, res) => {
  try {
    let hists = await historyController.find({})
    res.status(200).send(hists)
  } catch(err) {
    res.status(400).json({error: err})
  }
})

router.post('/report', auth, async (req, res) => {
  try {
    let hist = await historyController.findByAccId({
      accountId: req.body.accountId,
      startDate: req.body.startDate,
      endDate: req.body.endDate
    })
    res.status(200).send(hist)
  } catch(err) {
    res.status(400).json({error: err})
  }
})

router.delete('/:id', auth, async (req, res) => {
  try {
    await historyController.remove({_id: req.params.id})
    res.status(200).send()
  } catch(err) {
    res.status(400).json({error: err})
  }
})

module.exports = router
