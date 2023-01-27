import mongoose from "mongoose"
import {
  detailItemScheme,
  requireItemScheme,
  rewardItemScheme,
  craftableItemScheme,
} from "./InGameSubModels.js"

const inGameTaskItemRequirementsSchema = mongoose.Schema(
  {
    factionName: {
      type: String,
      required: true,
    },
    item: {
      type: detailItemScheme,
      required: true,
    },
    getFromReward: [
      {
        type: rewardItemScheme,
      },
    ],
    requiredByTask: [
      {
        type: requireItemScheme,
      },
    ],
    craftableAt: [
      {
        type: craftableItemScheme,
      },
    ],
  },
  {
    versionKey: false,
  }
)

const InGameTaskItemRequirements = mongoose.model(
  "InGameTaskItemRequirements",
  inGameTaskItemRequirementsSchema
)

export default InGameTaskItemRequirements
