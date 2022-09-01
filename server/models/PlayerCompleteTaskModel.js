import mongoose from "mongoose"
import User from "./UserModel.js"

const playerCompleteTaskSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  completeTasks: [
    {
      type: String,
      required: false,
    },
  ],
})

const PlayerCompleteTask = mongoose.model(
  "PlayerCompleteTask",
  playerCompleteTaskSchema
)

export default PlayerCompleteTask
