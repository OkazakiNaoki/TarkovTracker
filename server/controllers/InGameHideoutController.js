import asyncHandler from "express-async-handler"
import InGameHideoutLevels from "../models/InGameHideoutLevelsModel.js"

// @desc Get hideout levels
// @route GET /api/hideout/levels
// @access public
export const getHideoutLevels = asyncHandler(async (req, res) => {
  const itemId = req.query.itemId
  const itemName = req.query.itemName

  const match = itemId
    ? {
        "levels.itemRequirements.item.id": {
          $eq: itemId,
        },
      }
    : {
        "levels.itemRequirements.item.name": {
          $eq: itemName,
        },
      }

  const aggregateArr = [
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        "levels.level": 1,
        "levels.itemRequirements": 1,
      },
    },
    { $unwind: "$levels" },
    { $unwind: "$levels.itemRequirements" },
    {
      $match: match,
    },
  ]

  const hideout = await InGameHideoutLevels.aggregate(aggregateArr)

  res.json(hideout)
})
