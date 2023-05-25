import asyncHandler from "express-async-handler"
import PlayerCustomPreset from "../models/PlayerCustomPresetModel.js"

// @desc add weapon preset for a player
// @route POST /api/player/preset
// @access private
export const addWeaponPreset = asyncHandler(async (req, res) => {
  const existWp = await PlayerCustomPreset.findOne({ user: req.user._id })

  if (!existWp) {
    const wp = new PlayerCustomPreset({
      user: req.user._id,
    })
    const createdWp = await wp.save()
    res.status(201).json(createdWp.presets)
  } else {
    res.status(400).send("Exist old preset data")
  }
})

// @desc update weapon preset for a player
// @route PUT /api/player/preset
// @access private
export const updateWeaponPreset = asyncHandler(async (req, res) => {
  const preset = req.body.preset
  const presetIndex = req.body.index
  const isNew = req.body.new

  if (!preset) {
    res.status(400).send("Preset is empty")
    return
  } else {
    const existWp = await PlayerCustomPreset.findOne({ user: req.user._id })
    if (!existWp) {
      res.status(404).send("Previous presets not found")
    } else {
      if (isNew) {
        if (existWp.presets.length === 5) {
          res.status(400).send("Exceed the preset amount allow to save")
        } else {
          existWp.presets.push(preset)
        }
      } else {
        if (presetIndex < 5) {
          existWp.presets[presetIndex] = preset
        } else {
          res
            .status(400)
            .send("Index is out of range of available preset slot amount (5)")
        }
      }
    }

    await existWp.save()
    res.status(200).send("Preset saved")
  }
})

// @desc get weapon preset for a player
// @route GET /api/player/preset
// @access private
export const getWeaponPreset = asyncHandler(async (req, res) => {
  const wp = await PlayerCustomPreset.findOne({ user: req.user._id })
  if (!wp) {
    res.status(404).send("Previous presets not found")
  } else {
    res.json(wp.presets)
  }
})
