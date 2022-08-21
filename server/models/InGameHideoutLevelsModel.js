import mongoose from "mongoose"

const inGameHideoutLevelsSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  levels: [
    {
      type: Object,
      required: false,
    },
  ],
})

const InGameHideoutLevels = mongoose.model(
  "InGameHideoutLevels",
  inGameHideoutLevelsSchema
)

export default InGameHideoutLevels
