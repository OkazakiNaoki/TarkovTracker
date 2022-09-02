import mongoose from "mongoose"
import User from "./UserModel.js"

const playerTraderLLSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  traderLL: {
    type: Object,
    required: true,
  },
})

const PlayerTraderLL = mongoose.model("PlayerTraderLL", playerTraderLLSchema)

export default PlayerTraderLL
