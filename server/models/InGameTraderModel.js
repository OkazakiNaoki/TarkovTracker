import mongoose from "mongoose"

const inGameTraderSchema = mongoose.Schema({
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

const InGameTrader = mongoose.model("InGameTrader", inGameTraderSchema)

export default InGameTrader
