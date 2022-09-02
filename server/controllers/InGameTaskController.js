import asyncHandler from "express-async-handler"
import InGameTaskDesc from "../models/InGameTaskDescModel.js"
import InGameTaskImage from "../models/InGameTaskImageModel.js"
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
        __v: 0,
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

// @desc Get task image by task id
// @route GET /api/task/image
// @access public
export const getTaskImage = asyncHandler(async (req, res) => {
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
        image: 1,
      },
    },
  ]

  const taskImg = await InGameTaskImage.aggregate(aggregateArr)

  res.json(taskImg)
})

// @desc Get task description by task description id
// @route GET /api/task/desc
// @access public
export const getTaskDesc = asyncHandler(async (req, res) => {
  const desc_id = req.query.desc_id

  const aggregateArr = [
    {
      $match: {
        id: desc_id,
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        description: 1,
      },
    },
  ]

  const taskDesc = await InGameTaskDesc.aggregate(aggregateArr)

  res.json(taskDesc)
})
