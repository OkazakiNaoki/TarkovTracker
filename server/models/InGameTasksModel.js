import mongoose from "mongoose"
import {
  taskSchema,
  simpleTraderSchema,
  traderLevelSchema,
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
      type: simpleTraderSchema,
      required: true,
    },
    minPlayerLevel: {
      type: Number,
      required: true,
    },
    taskRequirements: [
      {
        type: taskSchema,
        required: false,
      },
    ],
    traderLevelRequirements: [
      {
        type: traderLevelSchema,
        required: false,
      },
    ],
    needForTasks: [
      {
        type: taskSchema,
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
