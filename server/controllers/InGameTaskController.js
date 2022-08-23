import asyncHandler from "express-async-handler"
import InGameTasks from "../models/InGameTasksModel.js"

// @desc Get tasks of a trader
// @route GET /api/task?trader=
// @access public
export const getTasksOfTrader = asyncHandler(async (req, res) => {
  const traderName = req.query.trader

  const aggregateArr = [
    {
      $match: {
        "trader.name": traderName,
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        trader: 1,
        minPlayerLevel: 1,
        taskRequirements: 1,
        traderLevelRequirements: 1,
        previousTaskChainCount: 1,
      },
    },
    {
      $sort: {
        previousTaskChainCount: 1,
        minPlayerLevel: 1,
      },
    },
  ]

  const tasks = await InGameTasks.aggregate(aggregateArr)

  res.json(tasks)
})

// @desc Get task of a trader
// @route GET /api/task/id
// @access public
export const getTaskById = asyncHandler(async (req, res) => {
  const id = req.query.id

  const aggregateArr = [
    {
      $match: {
        id: id,
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        trader: 1,
        minPlayerLevel: 1,
        taskRequirements: 1,
        traderLevelRequirements: 1,
        previousTaskChainCount: 1,
      },
    },
  ]

  const task = await InGameTasks.aggregate(aggregateArr)

  res.json(task)
})
