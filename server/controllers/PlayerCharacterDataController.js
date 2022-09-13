import asyncHandler from "express-async-handler"
import PlayerCharacterData from "../models/PlayerCharacterDataModel.js"

// @desc add character data for a player
// @route POST /api/player/character
// @access private
export const addCharacterData = asyncHandler(async (req, res) => {
  const characterData = req.body.characterData

  if (characterData && characterData.length === 0) {
    res.status(400).send("Character data is empty")
    return
  } else {
    const existPcd = await PlayerCharacterData.findOne({ user: req.user._id })
    if (!existPcd) {
      const pcd = new PlayerCharacterData({
        user: req.user._id,
        characterLevel: characterData.characterLevel,
        characterFaction: characterData.characterFaction,
      })
      const createdPcd = await pcd.save()
      res.status(201).json(createdPcd)
    } else {
      res.status(400).send("Exist old character data")
    }
  }
})

// @desc update character data for a player
// @route PUT /api/player/character
// @access private
export const updateCharacterData = asyncHandler(async (req, res) => {
  const characterData = req.body.characterData

  if (characterData && characterData.length === 0) {
    res.status(400).send("Character data is empty")
    return
  } else {
    const existPcd = await PlayerCharacterData.findOne({ user: req.user._id })
    if (!existPcd) {
      res.status(404).send("Previous character data not found")
    } else {
      existPcd.characterLevel = characterData.characterLevel
      existPcd.characterFaction = characterData.characterFaction
      const updatedPcd = await existPcd.save()
      res.json(updatedPcd)
    }
  }
})

// @desc get character data of a player
// @route GET /api/player/character
// @access private
export const getCharacterData = asyncHandler(async (req, res) => {
  const pcd = await PlayerCharacterData.findOne({ user: req.user._id })
  if (!pcd) {
    res.status(404).send("Previous character data not found")
  } else {
    res.json({
      characterLevel: pcd.characterLevel,
      characterFaction: pcd.characterFaction,
    })
  }
})
