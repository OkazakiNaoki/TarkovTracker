import mongoose from "mongoose"

const inGameItemPropertySchema = mongoose.Schema(
  {
    category: [
      {
        type: String,
        required: true,
      },
    ],
    propertyUnion: {
      type: String,
      required: true,
    },
    properties: [
      {
        type: String,
        required: true,
      },
    ],
    additionalProperty: [
      {
        type: String,
      },
    ],
    propertyRename: {
      type: Object,
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

const InGameItemProperty = mongoose.model(
  "InGameItemProperty",
  inGameItemPropertySchema
)

export default InGameItemProperty
