import mongoose from "mongoose"
import User from "./UserModel.js"
import { itemAmountScheme } from "./InGameSubModels.js"

const playerInventorySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  items: [
    {
      type: itemAmountScheme,
    },
  ],
})

const PlayerInventoryData = mongoose.model(
  "PlayerInventoryData",
  playerInventorySchema
)

export default PlayerInventoryData
