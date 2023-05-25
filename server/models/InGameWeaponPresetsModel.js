import mongoose from "mongoose"
import {
  simpleItemSchema,
  simpleHandbookSchema,
  itemAmountSchema,
} from "./InGameSubModels.js"

const presetPropertySchema = mongoose.Schema(
  {
    baseItem: {
      type: simpleItemSchema,
      required: true,
    },
    default: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
)

const inGameWeaponPresetSchema = mongoose.Schema(
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
    backgroundColor: {
      type: String,
      required: true,
    },
    handbookCategories: {
      type: simpleHandbookSchema,
      required: true,
    },
    containsItems: {
      type: [itemAmountSchema],
      validate: {
        validator: (arr) => {
          if (arr.length < 1) {
            throw new Error("nothing inside this preset")
          } else {
            return true
          }
        },
      },
      required: true,
    },
    properties: {
      type: presetPropertySchema,
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

const InGameWeaponPreset = mongoose.model(
  "InGameWeaponPreset",
  inGameWeaponPresetSchema
)

export default InGameWeaponPreset
