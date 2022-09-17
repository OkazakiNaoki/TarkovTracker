import mongoose from "mongoose"
import User from "./UserModel.js"

const hideoutProgress = mongoose.Schema({
  hideoutId: {
    type: String,
    required: true,
  },
  progress: [
    {
      type: String,
      required: true,
    },
  ],
})

const playerHideoutProgressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  hideoutProgress: [
    {
      type: hideoutProgress,
      required: true,
    },
  ],
})

const PlayerHideoutProgress = mongoose.model(
  "PlayerHideoutProgress",
  playerHideoutProgressSchema
)

export default PlayerHideoutProgress
