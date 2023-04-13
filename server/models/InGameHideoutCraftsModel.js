import mongoose from "mongoose"
import { itemAmountSchema, simpleStationSchema } from "./InGameSubModels.js"

const inGameHideoutCraftsSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    station: {
      type: simpleStationSchema,
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
        type: itemAmountSchema,
      },
    ],
    rewardItems: [
      {
        type: itemAmountSchema,
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
