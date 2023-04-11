import asyncHandler from "express-async-handler"
import InGameTraderLevels from "../models/InGameTraderModel.js"
import InGameUnlockableOffer from "../models/InGameUnlockableOfferModel.js"

// @desc Get level requirements of a trader
// @route GET /api/trader/levels
// @access public
export const getLevelReqOfTrader = asyncHandler(async (req, res) => {
  const traderName = req.query.trader

  const aggregateArr = [
    {
      $match: {
        name: traderName,
      },
    },
    {
      $project: {
        _id: 0,
        name: 1,
        levels: 1,
      },
    },
  ]

  const traderLevels = await InGameTraderLevels.aggregate(aggregateArr)

  res.json(traderLevels)
})

// @desc Get unlockable trade offers
// @route GET /api/trader/offers
// @access public
export const getUnlockableOffer = asyncHandler(async (req, res) => {
  const aggregateArr = [
    {
      $project: {
        _id: 0,
      },
    },
  ]

  const offers = await InGameUnlockableOffer.aggregate(aggregateArr)

  res.json(offers)
})
