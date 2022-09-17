import asyncHandler from "express-async-handler"
import PlayerHideoutLevel from "../models/PlayerHideoutLevelModel.js"
import PlayerHideoutProgress from "../models/PlayerHideoutProgressModel.js"

// @desc add progress of hideout for a player
// @route POST /api/player/hideout/progress
// @access private
export const addHideoutProgress = asyncHandler(async (req, res) => {
  const hideoutProgress = req.body.hideoutProgress

  const existPhp = await PlayerHideoutProgress.findOne({ user: req.user._id })
  if (!existPhp) {
    const php = new PlayerHideoutProgress({
      user: req.user._id,
      hideoutProgress: hideoutProgress,
    })
    const createdPhp = await php.save()
    res.status(201).json(createdPhp)
  } else {
    res.status(400).send("Exist old hideout progress data")
  }
})

// @desc update hideout progress for a player
// @route PUT /api/player/hideout/progress
// @access private
export const updateHideoutProgress = asyncHandler(async (req, res) => {
  const hideoutProgress = req.body.hideoutProgress

  if (hideoutProgress && hideoutProgress.length === 0) {
    res.status(400).send("Hideout progress is empty")
    return
  } else {
    const existPhp = await PlayerHideoutProgress.findOne({ user: req.user._id })
    if (!existPhp) {
      res.status(404).send("Previous hideout progress data not found")
    } else {
      existPhp.hideoutProgress = hideoutProgress
      const updatedPhp = await existPhp.save()
      res.json(updatedPhp)
    }
  }
})

// @desc get hideout progress of a player
// @route GET /api/player/hideout/progress
// @access private
export const getHideoutProgress = asyncHandler(async (req, res) => {
  const php = await PlayerHideoutProgress.findOne({ user: req.user._id })
  if (!php) {
    res.status(404).send("Previous hideout progress data not found")
  } else {
    res.json({
      hideoutProgress: php.hideoutProgress,
    })
  }
})

// @desc add level of hideout for a player
// @route POST /api/player/hideout/level
// @access private
export const addHideoutLevel = asyncHandler(async (req, res) => {
  const hideoutLevel = req.body.hideoutLevel

  const existPhl = await PlayerHideoutLevel.findOne({ user: req.user._id })
  if (!existPhl) {
    const phl = new PlayerHideoutLevel({
      user: req.user._id,
      hideoutLevel: hideoutLevel,
    })
    const createdPhl = await phl.save()
    res.status(201).json(createdPhl)
  } else {
    res.status(400).send("Exist old hideout level data")
  }
})

// @desc update hideout level for a player
// @route PUT /api/player/hideout/level
// @access private
export const updateHideoutLevel = asyncHandler(async (req, res) => {
  const hideoutLevel = req.body.hideoutLevel

  if (hideoutLevel && hideoutLevel.length === 0) {
    res.status(400).send("Hideout level is empty")
    return
  } else {
    const existPhl = await PlayerHideoutLevel.findOne({ user: req.user._id })
    if (!existPhl) {
      res.status(404).send("Previous hideout level data not found")
    } else {
      existPhl.hideoutLevel = hideoutLevel
      const updatedPhl = await existPhl.save()
      res.json(updatedPhl)
    }
  }
})

// @desc get hideout level of a player
// @route GET /api/player/hideout/level
// @access private
export const getHideoutLevel = asyncHandler(async (req, res) => {
  const phl = await PlayerHideoutLevel.findOne({ user: req.user._id })
  if (!phl) {
    res.status(404).send("Previous hideout level data not found")
  } else {
    res.json({
      hideoutLevel: phl.hideoutLevel,
    })
  }
})
