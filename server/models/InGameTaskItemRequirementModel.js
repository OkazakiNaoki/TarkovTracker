import mongoose from "mongoose"
import {
  firItemSchema,
  itemRequireByTaskSchema,
  taskItemRewardSchema,
  stationLevelSchema,
} from "./InGameSubModels.js"

const inGameTaskItemRequirementsSchema = mongoose.Schema(
  {
    factionName: {
      type: String,
      required: true,
    },
    item: {
      type: firItemSchema,
      required: true,
    },
    rewardTasks: [
      {
        type: taskItemRewardSchema,
      },
    ],
    requiredByTask: [
      {
        type: itemRequireByTaskSchema,
      },
    ],
    craftableStations: [
      {
        type: stationLevelSchema,
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
