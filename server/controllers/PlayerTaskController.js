import asyncHandler from "express-async-handler"
import PlayerCompleteTask from "../models/PlayerCompleteTaskModel.js"

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
