import mongoose from "mongoose"
import { traderLevelReq } from "./InGameSubModels.js"

const inGameTraderLevelsSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    levels: [
      {
        type: traderLevelReq,
      },
    ],
  },
  { versionKey: false }
)

const InGameTraderLevels = mongoose.model(
  "InGameTraderLevels",
  inGameTraderLevelsSchema
)

export default InGameTraderLevels
