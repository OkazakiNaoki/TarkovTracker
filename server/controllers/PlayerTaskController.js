import asyncHandler from "express-async-handler"
import PlayerCompleteTask from "../models/PlayerCompleteTaskModel.js"
import PlayerCompleteObjective from "../models/PlayerCompleteTaskObjectivesModel.js"

// @desc add completed tasks for a player
// @route POST /api/player/task/complete
// @access private
export const addCompleteTask = asyncHandler(async (req, res) => {
  const completetask = req.body.completetask

  if (completetask && completetask.length === 0) {
    res.status(400).send("Completed task is empty")
    return
  } else {
    const existPct = await PlayerCompleteTask.findOne({ user: req.user._id })
    if (!existPct) {
      const pct = new PlayerCompleteTask({
        user: req.user._id,
        completeTasks: completetask,
      })
      const createdPct = await pct.save()
      res.status(201).json(createdPct)
    } else {
      res.status(400).send("Exist old completed task data")
    }
  }
})

// @desc add completed tasks for a player
// @route PUT /api/player/task/complete
// @access private
export const updateCompleteTask = asyncHandler(async (req, res) => {
  const completetask = req.body.completetask

  if (completetask && completetask.length === 0) {
    res.status(400).send("Completed task is empty")
    return
  } else {
    const existPct = await PlayerCompleteTask.findOne({ user: req.user._id })
    if (!existPct) {
      res.status(404).send("Previous completed task data not found")
    } else {
      existPct.completeTasks = completetask
      const updatedPct = await existPct.save()
      res.json(updatedPct)
    }
  }
})

// @desc get completed tasks of a player
// @route GET /api/player/task/complete
// @access private
export const getCompleteTask = asyncHandler(async (req, res) => {
  const pct = await PlayerCompleteTask.findOne({ user: req.user._id })
  if (!pct) {
    res.status(404).send("Previous completed task data not found")
  } else {
    res.json({
      completeTasks: pct.completeTasks,
    })
  }
})

// @desc add completed objective of a task for a player
// @route POST /api/player/task/objective
// @access private
export const addCompleteTaskObjective = asyncHandler(async (req, res) => {
  const completeObjectives = req.body.completeObjectives

  if (completeObjectives && completeObjectives.length === 0) {
    res.status(400).send("Completed task objective is empty")
    return
  } else {
    const existPco = await PlayerCompleteObjective.findOne({
      user: req.user._id,
    })
    if (!existPco) {
      const pco = new PlayerCompleteObjective({
        user: req.user._id,
        completeObjectives: completeObjectives,
      })
      const createdPco = await pco.save()
      res.status(201).json(createdPco)
    } else {
      res.status(400).send("Exist old completed task objective data")
    }
  }
})

// @desc add completed objective of a task for a player
// @route PUT /api/player/task/objective
// @access private
export const updateCompleteTaskObjective = asyncHandler(async (req, res) => {
  const completeObjectives = req.body.completeObjectives

  if (completeObjectives && completeObjectives.length === 0) {
    res.status(400).send("Completed task objective task is empty")
    return
  } else {
    const existPco = await PlayerCompleteObjective.findOne({
      user: req.user._id,
    })
    if (!existPco) {
      res.status(404).send("Previous completed task objective data not found")
    } else {
      existPco.completeObjectives = completeObjectives
      const updatedPco = await existPco.save()
      res.json(updatedPco)
    }
  }
})

// @desc get completed objective of a tasks of a player
// @route GET /api/player/task/objective
// @access private
export const getCompleteTaskObjective = asyncHandler(async (req, res) => {
  const pco = await PlayerCompleteObjective.findOne({ user: req.user._id })
  if (!pco) {
    res.status(404).send("Previous completed task objective data not found")
  } else {
    res.json({
      completeObjectives: pco.completeObjectives,
    })
  }
})
