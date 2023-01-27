import mongoose from "mongoose"
import {
  taskScheme,
  simpleTraderScheme,
  traderLevelScheme,
} from "./InGameSubModels.js"

const inGameTasksSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    trader: {
      type: simpleTraderScheme,
      required: true,
    },
    minPlayerLevel: {
      type: Number,
      required: true,
    },
    taskRequirements: [
      {
        type: taskScheme,
        required: false,
      },
    ],
    traderLevelRequirements: [
      {
        type: traderLevelScheme,
        required: false,
      },
    ],
    needForTasks: [
      {
        type: taskScheme,
        required: false,
      },
    ],
    previousTaskChainCount: {
      type: Number,
      required: true,
    },
  },
  { versionKey: false }
)

const InGameTasks = mongoose.model("InGameTasks", inGameTasksSchema)

export default InGameTasks
