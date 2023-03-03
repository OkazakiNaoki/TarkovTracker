import asyncHandler from "express-async-handler"
import { find } from "lodash-es"
import PlayerCompleteTask from "../models/PlayerCompleteTaskModel.js"
import PlayerCompleteObjective from "../models/PlayerCompleteTaskObjectivesModel.js"
import PlayerObjectiveProgress from "../models/PlayerTaskObjectiveProgressModel.js"

// @desc add completed tasks for a player
// @route POST /api/player/task/complete
// @access private
export const addCompleteTask = asyncHandler(async (req, res) => {
  const completeTasks = req.body.completeTasks

  const existPct = await PlayerCompleteTask.findOne({ user: req.user._id })
  if (!existPct) {
    const pct = new PlayerCompleteTask({
      user: req.user._id,
      completeTasks: completeTasks,
    })
    const createdPct = await pct.save()
    res.status(201).json(createdPct)
  } else {
    res.status(400).send("Exist old completed task data")
  }
})

// @desc update completed tasks for a player
// @route PUT /api/player/task/complete
// @access private
export const updateCompleteTask = asyncHandler(async (req, res) => {
  const taskId = req.body.taskId

  if (!taskId) {
    res.status(400).send("Completed task is empty")
    return
  } else {
    const existPct = await PlayerCompleteTask.findOne({ user: req.user._id })
    if (!existPct) {
      res.status(404).send("Previous completed task data not found")
    } else {
      if (!existPct.completeTasks.includes(taskId)) {
        existPct.completeTasks.push(taskId)
        const updatedPct = await existPct.save()
        res.json(updatedPct)
      } else {
        res.status(400).send("Task id already exists")
      }
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
// @route POST /api/player/task/objective/complete
// @access private
export const addCompleteTaskObjective = asyncHandler(async (req, res) => {
  const completeObjectives = req.body.completeObjectives

  if (!completeObjectives) {
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

// @desc update completed objective of a task for a player
// @route PUT /api/player/task/objective/complete
// @access private
export const updateCompleteTaskObjective = asyncHandler(async (req, res) => {
  const taskId = req.body.taskId
  const objectiveId = req.body.objectiveId

  if (!taskId || !objectiveId) {
    res.status(400).send("Completed task objective task is empty")
    return
  } else {
    const existPco = await PlayerCompleteObjective.findOne({
      user: req.user._id,
    })
    if (!existPco) {
      res.status(404).send("Previous completed task objective data not found")
    } else {
      const targetTask = find(existPco.completeObjectives, { taskId: taskId })
      if (targetTask) {
        targetTask.objectives.push(objectiveId)
      } else {
        existPco.completeObjectives.push({ taskId, objectives: [objectiveId] })
      }
      const updatedPco = await existPco.save()
      res.json(updatedPco)
    }
  }
})

// @desc get completed objective of a tasks of a player
// @route GET /api/player/task/objective/complete
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

// @desc add progress of objective of a task for a player
// @route POST /api/player/task/objective/progress
// @access private
export const addTaskObjectiveProgress = asyncHandler(async (req, res) => {
  const objectiveProgress = req.body.objectiveProgress

  if (!objectiveProgress) {
    res.status(400).send("Progress of task objective is empty")
    return
  } else {
    const existOp = await PlayerObjectiveProgress.findOne({
      user: req.user._id,
    })
    if (!existOp) {
      const op = new PlayerObjectiveProgress({
        user: req.user._id,
        objectiveProgress: objectiveProgress,
      })
      const createdOp = await op.save()
      res.status(201).json(createdOp)
    } else {
      res.status(400).send("Exist old progress of task objective data")
    }
  }
})

// @desc update progress of objective of a task for a player
// @route PUT /api/player/task/objective/progress
// @access private
export const updateTaskObjectiveProgress = asyncHandler(async (req, res) => {
  const objectiveProgress = req.body.objectiveProgress

  if (objectiveProgress && objectiveProgress.length === 0) {
    res.status(400).send("Progress of task objective is empty")
    return
  } else {
    const existOp = await PlayerObjectiveProgress.findOne({
      user: req.user._id,
    })
    if (!existOp) {
      res.status(404).send("Previous progress of task objective data not found")
    } else {
      const targetObjective = find(existOp.objectiveProgress, {
        objectiveId: objectiveProgress.objectiveId,
      })
      if (targetObjective) {
        targetObjective.progress = objectiveProgress.progress
      } else {
        existOp.objectiveProgress.push(objectiveProgress)
      }
      const updatedOp = await existOp.save()
      res.json(updatedOp)
    }
  }
})

// @desc get progress of objective of a tasks of a player
// @route GET /api/player/task/objective/progress
// @access private
export const getTaskObjectiveProgress = asyncHandler(async (req, res) => {
  const op = await PlayerObjectiveProgress.findOne({ user: req.user._id })
  if (!op) {
    res.status(404).send("Previous progress of task objective data not found")
  } else {
    res.json({
      objectiveProgress: op.objectiveProgress,
    })
  }
})
