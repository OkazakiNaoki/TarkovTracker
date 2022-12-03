import mongoose from "mongoose"

const inGameTaskDescSchema = mongoose.Schema({
  taskId: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
})

const InGameTaskDesc = mongoose.model("InGameTaskDesc", inGameTaskDescSchema)

export default InGameTaskDesc
