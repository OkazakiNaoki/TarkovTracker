import mongoose from "mongoose"
import User from "./UserModel.js"

const playerCompleteTaskObjectiveSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  completeObjectives: [
    {
      type: String,
      required: false,
    },
  ],
})

const PlayerCompleteObjective = mongoose.model(
  "PlayerCompleteObjective",
  playerCompleteTaskObjectiveSchema
)

export default PlayerCompleteObjective
