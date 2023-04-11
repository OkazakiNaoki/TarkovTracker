import mongoose from "mongoose"
import {
  firItemScheme,
  itemRequireByTaskScheme,
  taskItemRewardScheme,
  stationLevelScheme,
} from "./InGameSubModels.js"

const inGameTaskItemRequirementsSchema = mongoose.Schema(
  {
    factionName: {
      type: String,
      required: true,
    },
    item: {
      type: firItemScheme,
      required: true,
    },
    rewardTasks: [
      {
        type: taskItemRewardScheme,
      },
    ],
    requiredByTask: [
      {
        type: itemRequireByTaskScheme,
      },
    ],
    craftableStations: [
      {
        type: stationLevelScheme,
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
