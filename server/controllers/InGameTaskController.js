import asyncHandler from "express-async-handler"
import InGameTasks from "../models/InGameTasksModel.js"
import InGameTaskItemRequirement from "../models/InGameTaskItemRequirementModel.js"
import InGameTaskDetail from "../models/InGameTaskDetailModel.js"

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

// @desc Get task via id
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

// @desc Get task detail via id
// @route GET /api/task/detail/id
// @access public
export const getTaskDetailById = asyncHandler(async (req, res) => {
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
      },
    },
  ]

  const taskDetail = await InGameTaskDetail.aggregate(aggregateArr)

  res.json(taskDetail)
})

// @desc Get item requirements of all task
// @route GET /api/task/require/item
// @access public
export const getTaskItemRequirements = asyncHandler(async (req, res) => {
  const aggregateArr = [
    {
      $project: {
        _id: 0,
      },
    },
  ]

  const taskItemReq = await InGameTaskItemRequirement.aggregate(aggregateArr)

  res.json(taskItemReq)
})
