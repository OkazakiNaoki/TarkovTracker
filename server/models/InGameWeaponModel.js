import mongoose from "mongoose"
import {
  simpleHandbookSchema,
  simpleItemSchema,
  slotSchema,
} from "./InGameSubModels.js"

const defaultAmmoSchema = mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    accuracyModifier: {
      type: Number,
      required: true,
    },
  },
  {
    _id: false,
  }
)

const weaponPropertySchema = mongoose.Schema(
  {
    centerOfImpact: {
      type: Number,
      required: true,
    },
    ergonomics: {
      type: Number,
      required: true,
    },
    recoilHorizontal: {
      type: Number,
      required: true,
    },
    recoilVertical: {
      type: Number,
      required: true,
    },
    fireModes: {
      type: [String],
      validate: {
        validator: function (arr) {
          if (arr.length < 1) {
            throw new Error("Fire mode array is empty")
          } else return true
        },
      },
      required: true,
    },
    fireRate: {
      type: Number,
      required: true,
    },
    effectiveDistance: {
      type: Number,
      required: true,
    },
    maxDurability: {
      type: Number,
      required: true,
    },
    sightingRange: {
      type: Number,
      required: true,
    },
    defaultPreset: {
      type: simpleItemSchema,
      required: false,
      default: null,
    },
    presets: {
      type: [simpleItemSchema],
      required: true,
    },
    slots: {
      type: [slotSchema],
      required: true,
    },
  },
  {
    _id: false,
  }
)

const inGameWeaponSchema = mongoose.Schema(
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
    defAmmo: {
      type: defaultAmmoSchema,
      required: true,
    },
    handbookCategories: {
      type: simpleHandbookSchema,
      required: true,
    },
    properties: {
      type: weaponPropertySchema,
      required: true,
    },
  },
  {
    versionKey: false,
  }
)

const InGameWeapon = mongoose.model("InGameWeapon", inGameWeaponSchema)

export default InGameWeapon
