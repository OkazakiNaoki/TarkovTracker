import asyncHandler from "express-async-handler"
import PlayerSkillProgress from "../models/PlayerSkillProgressModel.js"

// @desc get skill progress of a player
// @route GET /api/player/skill
// @access private
export const getSkillProgress = asyncHandler(async (req, res) => {
  const skillProgress = await PlayerSkillProgress.findOne({
    user: req.user._id,
  })
  if (!skillProgress) {
    res.status(404).send("Previous skill progress data not found")
  } else {
    res.json({
      skills: skillProgress.skills,
    })
  }
})

// @desc add skill progress of a player
// @route POST /api/player/skill
// @access private
export const addSkillProgress = asyncHandler(async (req, res) => {
  if (req.body && Object.keys(req.body).length === 0) {
    res.status(400).send("Skill progress post request is empty")
    return
  } else {
    const existSkillProgress = await PlayerSkillProgress.findOne({
      user: req.user._id,
    })
    if (!existSkillProgress) {
      const sp = new PlayerSkillProgress({
        user: req.user._id,
        skills: req.body.skills,
      })
      const createdSp = await sp.save()
      res.status(201).json(createdSp)
    } else {
      res.status(400).send("Exist skill progress data")
    }
  }
})

// @desc update skill progress of a player
// @route PUT /api/player/skill
// @access private
export const updateSkillProgress = asyncHandler(async (req, res) => {
  if (req.body && Object.keys(req.body).length === 0) {
    res.status(400).send("Skill progress update request is empty")
    return
  } else {
    const existSkillProgress = await PlayerSkillProgress.findOne({
      user: req.user._id,
    })
    if (!existSkillProgress) {
      res
        .status(404)
        .send("Previous skill progress data of this user is not found")
    } else {
      const found = existSkillProgress.skills.some((skill) => {
        if (skill.skillName === req.body.skill.skillName) {
          skill.level = req.body.skill.level
          return true
        }
      })
      if (!found) {
        res.status(404).send("Did not find the skill name that is requested")
      } else {
        const updatedSp = await existSkillProgress.save()
        res.json(updatedSp)
      }
    }
  }
})
