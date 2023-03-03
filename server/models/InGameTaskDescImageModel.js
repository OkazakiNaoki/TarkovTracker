import mongoose from "mongoose"

const inGameTaskDescImageSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

const InGameTaskDescImage = mongoose.model(
  "InGameTaskDescImage",
  inGameTaskDescImageSchema
)

export default InGameTaskDescImage
