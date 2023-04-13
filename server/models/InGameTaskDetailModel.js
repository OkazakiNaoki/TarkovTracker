import mongoose from "mongoose"
import {
  itemAmountSchema,
  simpleItemSchema,
  simpleTraderSchema,
  skillLevelSchema,
} from "./InGameSubModels.js"

const taskObjectiveSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    item: {
      type: simpleItemSchema,
      required: false,
    },
    count: {
      type: Number,
      required: false,
    },
  },
  { _id: false }
)

const justTraderNameSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
})

const traderStandingSchema = mongoose.Schema(
  {
    trader: {
      type: justTraderNameSchema,
      required: true,
    },
    standing: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
)

const offersSchema = mongoose.Schema(
  {
    trader: { type: justTraderNameSchema, required: true },
    level: { type: Number, required: true },
    item: { type: simpleItemSchema, required: true },
  },
  { _id: false }
)

const rewardsSchema = mongoose.Schema(
  {
    traderStanding: [{ type: traderStandingSchema, required: false }],
    items: [{ type: itemAmountSchema, required: false }],
    offerUnlock: [{ type: offersSchema, required: false }],
    skillLevelReward: [{ type: skillLevelSchema, required: false }],
    traderUnlock: [{ type: simpleTraderSchema, required: false }],
  },
  { _id: false }
)

const inGameTaskDetailSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    experience: {
      type: Number,
      required: true,
    },
    objectives: [
      {
        type: taskObjectiveSchema,
        validate: {
          validator: function (v) {
            return v.length > 0
          },
          message: (props) => `${props.value} length is not greater than zero`,
        },
        required: [true, "must have objectives"],
      },
    ],
    startRewards: {
      type: rewardsSchema,
      required: false,
    },
    finishRewards: {
      type: rewardsSchema,
      required: false,
    },
  },
  { versionKey: false }
)

const InGameTaskDetail = mongoose.model(
  "InGameTaskDetail",
  inGameTaskDetailSchema
)

export default InGameTaskDetail
