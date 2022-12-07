import mongoose from "mongoose"
import User from "./UserModel.js"

const playerTraderProgressSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  traderRep: {
    type: Object,
    required: true,
  },
  traderSpent: {
    type: Object,
    required: true,
  },
})

const PlayerTraderProgress = mongoose.model(
  "PlayerTraderProgress",
  playerTraderProgressSchema
)

export default PlayerTraderProgress
