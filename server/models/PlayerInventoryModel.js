import mongoose from "mongoose"
import User from "./UserModel.js"

const itemSchema = mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  count: {
    type: Number,
    required: true,
  },
})

const playerInventorySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  ownItemList: [
    {
      type: itemSchema,
      required: true,
    },
  ],
})

const PlayerInventoryData = mongoose.model(
  "PlayerInventoryData",
  playerInventorySchema
)

export default PlayerInventoryData
