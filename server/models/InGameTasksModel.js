import mongoose from "mongoose"

const inGameTasksSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  trader: {
    type: Object,
    required: true,
  },
  minPlayerLevel: {
    type: Number,
    required: true,
  },
  taskRequirements: [
    {
      type: Object,
      required: false,
    },
  ],
  traderLevelRequirements: [
    {
      type: Object,
      required: false,
    },
  ],
  needForTasks: [
    {
      type: Object,
      required: false,
    },
  ],
  previousTaskChainCount: {
    type: Number,
    required: true,
  },
})

const InGameTasks = mongoose.model("InGameTasks", inGameTasksSchema)

export default InGameTasks
