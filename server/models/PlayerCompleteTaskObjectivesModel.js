import mongoose from "mongoose"
import User from "./UserModel.js"

const completeObjectiveScheme = mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  objectives: [
    {
      type: String,
    },
  ],
})

const playerCompleteTaskObjectiveSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  completeObjectives: [
    {
      type: completeObjectiveScheme,
    },
  ],
})

const PlayerCompleteObjective = mongoose.model(
  "PlayerCompleteObjective",
  playerCompleteTaskObjectiveSchema
)

export default PlayerCompleteObjective
