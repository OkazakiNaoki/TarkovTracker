import mongoose from "mongoose"
import { simpleItemScheme } from "./InGameSubModels.js"

const inGameUnlockableOfferScheme = mongoose.Schema(
  {
    taskId: {
      type: String,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    taskTrader: {
      type: String,
      required: true,
    },
    offerTrader: {
      type: String,
      required: true,
    },
    offerTraderLevel: {
      type: Number,
      required: true,
    },
    offerItem: {
      type: simpleItemScheme,
      required: true,
    },
  },
  { versionKey: false }
)

const InGameUnlockableOffer = mongoose.model(
  "InGameUnlockableOffer",
  inGameUnlockableOfferScheme
)

export default InGameUnlockableOffer
