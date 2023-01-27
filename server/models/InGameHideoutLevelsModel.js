import mongoose from "mongoose"
import { hideoutLevels } from "./InGameSubModels.js"

const inGameHideoutLevelsSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    levels: [
      {
        type: hideoutLevels,
      },
    ],
  },
  {
    versionKey: false,
  }
)

const InGameHideoutLevels = mongoose.model(
  "InGameHideoutLevels",
  inGameHideoutLevelsSchema
)

export default InGameHideoutLevels
