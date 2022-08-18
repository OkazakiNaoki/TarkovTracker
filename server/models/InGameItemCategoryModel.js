import mongoose from "mongoose"

const inGameItemCategorySchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  parent: {
    type: Object,
  },
})

const InGameItemCategory = mongoose.model(
  "InGameItemCategory",
  inGameItemCategorySchema
)

export default InGameItemCategory
