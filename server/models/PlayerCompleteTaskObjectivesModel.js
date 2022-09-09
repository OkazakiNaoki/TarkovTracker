import mongoose from "mongoose"
import User from "./UserModel.js"

const taskAndCompletedObjectives = mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  objectives: [
    {
      type: String,
      required: false,
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
      type: taskAndCompletedObjectives,
      required: false,
    },
  ],
})

const PlayerCompleteObjective = mongoose.model(
  "PlayerCompleteObjective",
  playerCompleteTaskObjectiveSchema
)

export default PlayerCompleteObjective
