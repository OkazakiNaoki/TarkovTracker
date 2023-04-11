import mongoose from "mongoose"
import User from "./UserModel.js"

const unlockedOfferSchema = mongoose.Schema(
  {
    itemId: {
      type: String,
      required: true,
    },
    trader: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    unlocked: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
)

const playerUnlockedOfferSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  unlockedOffers: [
    {
      type: unlockedOfferSchema,
    },
  ],
})

const PlayerUnlockedOffer = mongoose.model(
  "PlayerUnlockedOffer",
  playerUnlockedOfferSchema
)

export default PlayerUnlockedOffer
