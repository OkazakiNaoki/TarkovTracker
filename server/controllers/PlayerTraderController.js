import asyncHandler from "express-async-handler"
import PlayerTraderProgress from "../models/PlayerTraderProgressModel.js"
import PlayerUnlockedTrader from "../models/PlayerUnlockedTraderModel.js"

// @desc get trader progress of a player
// @route GET /api/player/trader/LL
// @access private
export const getTraderProgress = asyncHandler(async (req, res) => {
  const traderProgress = await PlayerTraderProgress.findOne({
    user: req.user._id,
  })
  if (!traderProgress) {
    res.status(404).send("Previous trader progress data not found")
  } else {
    res.json({
      traderLL: traderProgress.traderLL,
      traderRep: traderProgress.traderRep,
      traderSpent: traderProgress.traderSpent,
    })
  }
})

// @desc add trader progress of a player
// @route POST /api/player/trader/LL
// @access private
export const addTraderProgress = asyncHandler(async (req, res) => {
  if (req.body && Object.keys(req.body).length === 0) {
    res.status(400).send("Trader progress is empty")
    return
  } else {
    const existTraderProgress = await PlayerTraderProgress.findOne({
      user: req.user._id,
    })
    if (!existTraderProgress) {
      const tp = new PlayerTraderProgress({
        user: req.user._id,
        traderLL: req.body.traderLL,
        traderRep: req.body.traderRep,
        traderSpent: req.body.traderSpent,
      })
      const createdTp = await tp.save()
      res.status(201).json(createdTp)
    } else {
      res.status(400).send("Exist trader progress data")
    }
  }
})

// @desc update trader progress of a player
// @route PUT /api/player/trader/LL
// @access private
export const updateTraderProgress = asyncHandler(async (req, res) => {
  if (req.body && Object.keys(req.body).length === 0) {
    res.status(400).send("Trader progress is empty")
    return
  } else {
    const existTraderProgress = await PlayerTraderProgress.findOne({
      user: req.user._id,
    })
    if (!existTraderProgress) {
      res.status(404).send("Previous trader progress data not found")
    } else {
      existTraderProgress.traderLL = req.body.traderLL
      existTraderProgress.traderRep = req.body.traderRep
      existTraderProgress.traderSpent = req.body.traderSpent
      const updatedTp = await existTraderProgress.save()
      res.json(updatedTp)
    }
  }
})

// @desc get unlocked trader of a player
// @route GET /api/player/trader/unlock
// @access private
export const getTraderUnlock = asyncHandler(async (req, res) => {
  const traderUnlock = await PlayerUnlockedTrader.findOne({
    user: req.user._id,
  })
  if (!traderUnlock) {
    res.status(404).send("Previous unlocked trader data not found")
  } else {
    res.json({
      traders: traderUnlock.traders,
    })
  }
})

// @desc add unlocked trader of a player
// @route POST /api/player/trader/unlock
// @access private
export const addTraderUnlock = asyncHandler(async (req, res) => {
  if (req.body && Object.keys(req.body).length === 0) {
    res.status(400).send("Trader progress is empty")
    return
  } else {
    const existUnlockedTrader = await PlayerUnlockedTrader.findOne({
      user: req.user._id,
    })
    if (!existUnlockedTrader) {
      const ut = new PlayerUnlockedTrader({
        user: req.user._id,
        traders: req.body.traders,
      })
      const createdUt = await ut.save()
      res.status(201).json(createdUt)
    } else {
      res.status(400).send("Exist unlocked trader data")
    }
  }
})

// @desc update unlocked trader of a player
// @route PUT /api/player/trader/unlock
// @access private
export const updateTraderUnlock = asyncHandler(async (req, res) => {
  if (req.body && Object.keys(req.body).length === 0) {
    res.status(400).send("Unlocked trader is empty")
    return
  } else {
    const existUnlockedTrader = await PlayerUnlockedTrader.findOne({
      user: req.user._id,
    })
    if (!existUnlockedTrader) {
      res.status(404).send("Previous unlocked trader data not found")
    } else {
      existUnlockedTrader.traders.some((trader, i) => {
        if (trader.traderName === req.body.trader.name) {
          existUnlockedTrader.traders[i].unlocked = req.body.trader.unlocked
          return true
        }
      })
      const updatedUt = await existUnlockedTrader.save()
      res.json(updatedUt)
    }
  }
})
