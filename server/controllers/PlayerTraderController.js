import asyncHandler from "express-async-handler"
import PlayerTraderLL from "../models/PlayerTraderLoyaltyLevelModel.js"

// @desc get trader loyalty level of a player
// @route GET /api/player/trader/LL
// @access private
export const getTraderLL = asyncHandler(async (req, res) => {
  const traderLL = await PlayerTraderLL.findOne({ user: req.user._id })
  if (!traderLL) {
    res.status(404).send("Previous trader loyalty level data not found")
  } else {
    res.json({
      traderLL: traderLL.traderLL,
    })
  }
})

// @desc add trader loyalty level of a player
// @route POST /api/player/trader/LL
// @access private
export const addTraderLL = asyncHandler(async (req, res) => {
  const LL = req.body.LL

  if (LL && Object.keys(LL).length === 0) {
    res.status(400).send("Loyalty level is empty")
    return
  } else {
    const existTraderLL = await PlayerTraderLL.findOne({
      user: req.user._id,
    })
    if (!existTraderLL) {
      const tll = new PlayerTraderLL({
        user: req.user._id,
        traderLL: LL,
      })
      const createdTll = await tll.save()
      res.status(201).json(createdTll)
    } else {
      res.status(400).send("Exist loyalty level data")
    }
  }
})

// @desc update trader loyalty level of a player
// @route PUT /api/player/trader/LL
// @access private
export const updateTraderLL = asyncHandler(async (req, res) => {
  const LL = req.body.LL

  if (LL && Object.keys(LL).length === 0) {
    res.status(400).send("Loyalty level is empty")
    return
  } else {
    const existTraderLL = await PlayerTraderLL.findOne({
      user: req.user._id,
    })
    if (!existTraderLL) {
      res.status(404).send("Previous loyalty level data not found")
    } else {
      existTraderLL.traderLL = LL
      const updatedTll = await existTraderLL.save()
      res.json(updatedTll)
    }
  }
})
