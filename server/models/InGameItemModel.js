import mongoose from "mongoose"
import { itemCategorySchema, simpleHandbookSchema } from "./InGameSubModels.js"

const inGameItemSchema = mongoose.Schema(
  {
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
        type: itemCategorySchema,
      },
    ],
    handbookCategories: [
      {
        type: simpleHandbookSchema,
      },
    ],
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    backgroundColor: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

const InGameItem = mongoose.model("InGameItem", inGameItemSchema)

export default InGameItem
