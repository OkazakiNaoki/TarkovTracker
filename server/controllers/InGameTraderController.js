import asyncHandler from "express-async-handler"
import InGameTraderLevels from "../models/InGameTraderModel.js"

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
