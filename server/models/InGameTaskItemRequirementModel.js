import mongoose from "mongoose"

const itemScheme = mongoose.Schema({
  itemId: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  bgColor: {
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
})

const requireScheme = mongoose.Schema({
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
})

const rewardScheme = mongoose.Schema({
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
})

const stationScheme = mongoose.Schema({
  stationName: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
})

const inGameTaskItemRequirementsSchema = mongoose.Schema({
  item: {
    type: itemScheme,
    required: true,
  },
  getFromReward: [
    {
      type: rewardScheme,
      required: false,
    },
  ],
  requiredByTask: [
    {
      type: requireScheme,
      required: true,
    },
  ],
  craftableAt: [
    {
      type: stationScheme,
      required: false,
    },
  ],
})

const InGameTaskItemRequirements = mongoose.model(
  "InGameTaskItemRequirements",
  inGameTaskItemRequirementsSchema
)

export default InGameTaskItemRequirements
