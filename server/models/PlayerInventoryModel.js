import mongoose from "mongoose"
import User from "./UserModel.js"
import { itemAmountSchema } from "./InGameSubModels.js"

const playerInventorySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  items: [
    {
      type: itemAmountSchema,
    },
  ],
})

const PlayerInventoryData = mongoose.model(
  "PlayerInventoryData",
  playerInventorySchema
)

export default PlayerInventoryData
