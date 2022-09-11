import mongoose from "mongoose"
import User from "./UserModel.js"

const objectiveProgress = mongoose.Schema({
  objectiveId: {
    type: String,
    required: true,
  },
  progress: {
    type: Number,
    required: true,
  },
})

const playerTaskObjectiveProgressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  objectiveProgress: [
    {
      type: objectiveProgress,
      required: true,
    },
  ],
})

const PlayerObjectiveProgress = mongoose.model(
  "PlayerObjectiveProgress",
  playerTaskObjectiveProgressSchema
)

export default PlayerObjectiveProgress
