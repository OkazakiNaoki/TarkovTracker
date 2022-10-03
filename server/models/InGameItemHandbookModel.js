import mongoose from "mongoose"

const inGameItemHandbookSchema = mongoose.Schema({
  handbookCategoryId: {
    type: String,
    required: true,
  },
  handbookCategoryName: {
    type: String,
    required: true,
  },
  handbookCategoryIcon: {
    type: String,
    required: false,
  },
  handbookCategoryParent: {
    type: String,
    required: false,
  },
})

const InGameItemHandbook = mongoose.model(
  "InGameItemHandbook",
  inGameItemHandbookSchema
)

export default InGameItemHandbook
