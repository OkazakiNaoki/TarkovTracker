import mongoose from "mongoose"
import {
  stationLevelScheme,
  simpleTaskScheme,
  itemAmountScheme,
  taskItemRewardScheme,
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
      type: simpleTaskScheme,
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
      type: simpleTaskScheme,
    },
    requiredItems: [
      {
        type: itemAmountScheme,
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
        type: taskItemRewardScheme,
      },
    ],
    craftableStations: [
      {
        type: stationLevelScheme,
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
        type: stationLevelScheme,
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
