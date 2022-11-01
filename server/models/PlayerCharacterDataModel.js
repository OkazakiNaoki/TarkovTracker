import mongoose from "mongoose"
import User from "./UserModel.js"

const playerCharacterDataSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: User,
  },
  characterLevel: {
    type: Number,
    required: true,
  },
  characterFaction: {
    type: String,
    required: true,
  },
  gameEdition: {
    type: String,
    required: true,
  },
})

const PlayerCharacterData = mongoose.model(
  "PlayerCharacterData",
  playerCharacterDataSchema
)

export default PlayerCharacterData
