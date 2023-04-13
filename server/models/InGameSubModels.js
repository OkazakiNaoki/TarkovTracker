import mongoose from "mongoose"

// item related
export const simpleItemSchema = mongoose.Schema(
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
    shortName: {
      type: String,
      required: false,
    },
  },
  { _id: false }
)

export const firItemSchema = mongoose.Schema(
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

export const itemAmountSchema = mongoose.Schema(
  {
    item: {
      type: simpleItemSchema,
      required: true,
    },
    count: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

// item category related
export const simpleHandbookSchema = mongoose.Schema(
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

export const itemCategorySchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

// task related
export const simpleTaskSchema = mongoose.Schema(
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

// trader related
export const simpleTraderSchema = mongoose.Schema(
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

export const traderLevelSchema = mongoose.Schema(
  {
    trader: {
      type: simpleTraderSchema,
      required: true,
    },
    level: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

// skill related
export const skillLevelSchema = mongoose.Schema(
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

// task related
export const itemRequireByTaskSchema = mongoose.Schema(
  {
    trader: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
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

export const taskItemRewardSchema = mongoose.Schema(
  {
    trader: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
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

export const taskSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    trader: { type: simpleTraderSchema, required: true },
  },
  { _id: false }
)

// requirement related
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

// hideout related
export const simpleStationSchema = mongoose.Schema(
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

export const craftIdSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
)

export const stationLevelSchema = mongoose.Schema(
  {
    station: {
      type: simpleStationSchema,
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
        type: itemAmountSchema,
      },
    ],
    stationLevelRequirements: [
      {
        type: stationLevelSchema,
      },
    ],
    skillRequirements: [
      {
        type: skillLevelSchema,
      },
    ],
    traderRequirements: [
      {
        type: traderLevelSchema,
      },
    ],
    crafts: [
      {
        type: craftIdSchema,
      },
    ],
  },
  {
    _id: false,
  }
)
