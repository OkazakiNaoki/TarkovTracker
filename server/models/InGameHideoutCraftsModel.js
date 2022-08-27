import mongoose from "mongoose"

const inGameHideoutCraftsSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  station: {
    type: Object,
    required: true,
  },
  level: {
    type: Number,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  requiredItems: [
    {
      type: Object,
      required: true,
    },
  ],
  rewardItems: [
    {
      type: Object,
      required: true,
    },
  ],
})

const InGameHideoutCrafts = mongoose.model(
  "InGameHideoutCrafts",
  inGameHideoutCraftsSchema
)

export default InGameHideoutCrafts
