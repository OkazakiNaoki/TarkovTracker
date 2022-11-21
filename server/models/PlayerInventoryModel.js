import mongoose from "mongoose"
import User from "./UserModel.js"

const itemSchema = mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    itemName: {
      type: String,
      required: true,
    },
    bgColor: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const playerInventorySchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  items: [
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
