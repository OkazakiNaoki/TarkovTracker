import mongoose from "mongoose"
import User from "./UserModel.js"

const unlockedTraderSchema = mongoose.Schema(
  {
    traderName: {
      type: String,
      required: true,
    },
    unlocked: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
)

const playerUnlockedTraderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  traders: [
    {
      type: unlockedTraderSchema,
      required: true,
    },
  ],
})

const PlayerUnlockedTrader = mongoose.model(
  "PlayerUnlockedTrader",
  playerUnlockedTraderSchema
)

export default PlayerUnlockedTrader
