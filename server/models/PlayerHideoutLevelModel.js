import mongoose from "mongoose"
import User from "./UserModel.js"

const hideoutLevel = mongoose.Schema({
  hideoutId: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  finishTime: {
    type: String,
    required: false,
  },
})

const playerHideoutLevelSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  hideoutLevel: [
    {
      type: hideoutLevel,
      required: true,
    },
  ],
})

const PlayerHideoutLevel = mongoose.model(
  "PlayerHideoutLevel",
  playerHideoutLevelSchema
)

export default PlayerHideoutLevel
