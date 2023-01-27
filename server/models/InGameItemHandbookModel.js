import mongoose from "mongoose"

const inGameItemHandbookSchema = mongoose.Schema(
  {
    handbookCategoryId: {
      type: String,
      required: true,
    },
    handbookCategoryName: {
      type: String,
      required: true,
    },
    handbookCategoryParent: {
      type: String,
      required: false,
    },
    handbookCategoryIcon: {
      type: String,
      required: false,
    },
  },
  {
    versionKey: false,
  }
)

const InGameItemHandbook = mongoose.model(
  "InGameItemHandbook",
  inGameItemHandbookSchema
)

export default InGameItemHandbook
