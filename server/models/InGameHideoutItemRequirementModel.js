import mongoose from "mongoose"
import {
  stationLevelSchema,
  simpleTaskSchema,
  itemAmountSchema,
  taskItemRewardSchema,
} from "./InGameSubModels.js"

const traderBuyItemScheme = mongoose.Schema(
  {
    trader: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
    },
    taskUnlock: {
      type: simpleTaskSchema,
    },
    price: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

const traderBarterItemScheme = mongoose.Schema(
  {
    trader: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
    taskUnlock: {
      type: simpleTaskSchema,
    },
    requiredItems: [
      {
        type: itemAmountSchema,
      },
    ],
  },
  { _id: false }
)

const itemScheme = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    backgroundColor: {
      type: String,
      required: true,
    },
    shortName: {
      type: String,
      required: true,
    },
    rewardTasks: [
      {
        type: taskItemRewardSchema,
      },
    ],
    craftableStations: [
      {
        type: stationLevelSchema,
      },
    ],
    buyable: [{ type: traderBuyItemScheme }],
    barterable: [{ type: traderBarterItemScheme }],
  },
  { _id: false }
)

const inGameHideoutItemRequirementsSchema = mongoose.Schema(
  {
    levels: [
      {
        type: stationLevelSchema,
      },
    ],
    item: {
      type: itemScheme,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

const InGameHideoutItemRequirements = mongoose.model(
  "InGameHideoutItemRequirements",
  inGameHideoutItemRequirementsSchema
)

export default InGameHideoutItemRequirements
