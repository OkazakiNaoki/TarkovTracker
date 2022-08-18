import mongoose from "mongoose"

const inGameItemAmmoCaliberSchema = mongoose.Schema({
  caliber: {
    type: String,
    required: true,
  },
  ammunition: {
    type: String,
    required: true,
  },
})

const InGameItemAmmoCaliber = mongoose.model(
  "InGameItemAmmoCaliber",
  inGameItemAmmoCaliberSchema
)

export default InGameItemAmmoCaliber
