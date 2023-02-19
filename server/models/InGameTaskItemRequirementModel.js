import mongoose from "mongoose"
import {
  detailItemScheme,
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
      type: detailItemScheme,
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
