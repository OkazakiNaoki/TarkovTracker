import mongoose from "mongoose"

const inGameTaskImageSchema = mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
})

const InGameTaskImage = mongoose.model("InGameTaskImage", inGameTaskImageSchema)

export default InGameTaskImage
