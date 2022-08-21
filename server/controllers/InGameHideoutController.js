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
        "levels.itemRequirements": {
          $elemMatch: {
            "item.id": itemId,
          },
        },
      }
    : {
        "levels.itemRequirements": {
          $elemMatch: {
            "item.name": itemName,
          },
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
    {
      $match: match,
    },
  ]

  const hideout = await InGameHideoutLevels.aggregate(aggregateArr)

  res.json(hideout)
})
