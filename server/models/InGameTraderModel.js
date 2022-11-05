import mongoose from "mongoose"

const levelsReq = mongoose.Schema({
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
})

const inGameTraderLevelsSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  levels: [
    {
      type: levelsReq,
      required: true,
    },
  ],
})

const InGameTraderLevels = mongoose.model(
  "InGameTraderLevels",
  inGameTraderLevelsSchema
)

export default InGameTraderLevels
