import mongoose from "mongoose"
import { itemAmountScheme, simpleStationScheme } from "./InGameSubModels.js"

const inGameHideoutCraftsSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    station: {
      type: simpleStationScheme,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    duration: {
      type: Number,
      required: true,
    },
    requiredItems: [
      {
        type: itemAmountScheme,
      },
    ],
    rewardItems: [
      {
        type: itemAmountScheme,
      },
    ],
  },
  {
    versionKey: false,
  }
)

const InGameHideoutCrafts = mongoose.model(
  "InGameHideoutCrafts",
  inGameHideoutCraftsSchema
)

export default InGameHideoutCrafts
