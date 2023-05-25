import mongoose from "mongoose"
import { simpleHandbookSchema, slotSchema } from "./InGameSubModels.js"

const modPropertySchema = mongoose.Schema(
  {
    centerOfImpact: {
      type: Number,
      required: false,
    },
    ergonomics: {
      type: Number,
      required: true,
    },
    recoilModifier: {
      type: Number,
      required: true,
    },
    accuracyModifier: {
      type: Number,
      required: false,
    },
    sightingRange: {
      type: Number,
      required: false,
    },
    zoomLevels: {
      type: [[Number]],
      required: false,
      default: undefined,
    },
    capacity: {
      type: Number,
      required: false,
    },
    slots: {
      type: [slotSchema],
      required: false,
    },
  },
  {
    _id: false,
  }
)

const inGameModSchema = mongoose.Schema(
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
    width: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    handbookCategories: {
      type: [simpleHandbookSchema],
      required: true,
    },
    properties: {
      type: modPropertySchema,
      required: true,
    },
    conflictingItems: {
      type: [String],
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

const InGameMod = mongoose.model("InGameMod", inGameModSchema)

export default InGameMod
