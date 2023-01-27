import mongoose from "mongoose"

export const itemCategoryScheme = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

export const simpleHandbookScheme = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

export const simpleStationScheme = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

export const simpleItemScheme = mongoose.Schema(
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
      required: false,
    },
  },
  { _id: false }
)

export const detailItemScheme = mongoose.Schema(
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
    foundInRaid: {
      type: Boolean,
      required: true,
    },
    dogTagLevel: {
      type: Number,
      required: false,
      default: null,
    },
  },
  { _id: false }
)

export const simpleTraderScheme = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

export const craftIdScheme = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

export const itemAmountScheme = mongoose.Schema(
  {
    item: {
      type: simpleItemScheme,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const stationLevelScheme = mongoose.Schema(
  {
    station: {
      type: simpleStationScheme,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const skillLevelScheme = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

export const traderLevelScheme = mongoose.Schema(
  {
    trader: {
      type: simpleTraderScheme,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

export const hideoutLevels = mongoose.Schema(
  {
    level: {
      type: Number,
      required: true,
    },
    constructionTime: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    itemRequirements: [
      {
        type: itemAmountScheme,
      },
    ],
    stationLevelRequirements: [
      {
        type: stationLevelScheme,
      },
    ],
    skillRequirements: [
      {
        type: skillLevelScheme,
      },
    ],
    traderRequirements: [
      {
        type: traderLevelScheme,
      },
    ],
    crafts: [
      {
        type: craftIdScheme,
      },
    ],
  },
  {
    _id: false,
  }
)

export const requireItemScheme = mongoose.Schema(
  {
    trader: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    objectiveId: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

export const rewardItemScheme = mongoose.Schema(
  {
    trader: {
      type: String,
      required: true,
    },
    taskId: {
      type: String,
      required: true,
    },
    taskName: {
      type: String,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

export const craftableItemScheme = mongoose.Schema(
  {
    stationName: {
      type: String,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

export const taskScheme = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    trader: { type: simpleTraderScheme, required: true },
  },
  { _id: false }
)

export const traderLevelReq = mongoose.Schema(
  {
    requiredReputation: {
      type: Number,
      required: true,
    },
    requiredPlayerLevel: {
      type: Number,
      required: true,
    },
    requiredCommerce: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)
