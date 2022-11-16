import mongoose from "mongoose"
import User from "./UserModel.js"

const skill = mongoose.Schema(
  {
    skillName: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const playerSkillProgressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  skills: [
    {
      type: skill,
      required: true,
    },
  ],
})

const PlayerSkillProgress = mongoose.model(
  "PlayerSkillProgress",
  playerSkillProgressSchema
)

export default PlayerSkillProgress
