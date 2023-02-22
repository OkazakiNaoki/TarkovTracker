import mongoose from "mongoose"
import User from "./UserModel.js"

const preferenceSchema = mongoose.Schema(
  {
    showCompletedTaskItemReq: {
      type: Boolean,
      required: true,
    },
    questItemsFilterDelay: {
      type: Number,
      required: true,
    },
    fleaMarketItemIconResolution: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const userPreferenceSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  preference: {
    type: preferenceSchema,
    required: true,
  },
})

const UserPreferenceData = mongoose.model(
  "UserPreferenceData",
  userPreferenceSchema
)

export default UserPreferenceData
