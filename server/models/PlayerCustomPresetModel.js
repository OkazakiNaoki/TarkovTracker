import mongoose from "mongoose"
import User from "./UserModel.js"

let modSchema = {}

const simplifiedSlotSchema = mongoose.Schema(
  {
    slotIndex: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    installed: {
      type: modSchema,
      required: false,
    },
    required: {
      type: Boolean,
      required: true,
    },
  },
  { _id: false }
)

const presetBaseSchema = mongoose.Schema(
  {
    presetName: {
      type: String,
      required: true,
    },
    partIndex: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    slots: {
      type: [simplifiedSlotSchema],
      required: false,
    },
    nextPartIndex: {
      type: Number,
      required: true,
    },
    nextSlotIndex: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

modSchema = mongoose.Schema(
  {
    partIndex: {
      type: Number,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    slots: {
      type: [simplifiedSlotSchema],
      required: false,
    },
  },
  { _id: false }
)

const playerCustomPresetSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  presets: {
    type: [presetBaseSchema],
    required: false,
  },
})

const PlayerCustomPreset = mongoose.model(
  "PlayerCustomPreset",
  playerCustomPresetSchema
)

export default PlayerCustomPreset
