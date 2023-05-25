import express from "express"
import {
  getItem,
  getItemProperties,
  getItemAmmoCaliber,
} from "../controllers/InGameItemController.js"
import { getMod, getWeapon } from "../controllers/InGameWeaponModController.js"

const router = express.Router()

router.route("/").get(getItem)
router.route("/properties").get(getItemProperties)
router.route("/caliber").get(getItemAmmoCaliber)
router.route("/weapon").get(getWeapon)
router.route("/mod").get(getMod)

export default router
