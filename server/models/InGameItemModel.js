import mongoose from "mongoose"

const inGameItemSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  shortName: {
    type: String,
    required: true,
  },
  categories: [
    {
      type: Object,
      required: true,
    },
  ],
})

const InGameItem = mongoose.model("InGameItem", inGameItemSchema)

export default InGameItem
