import express from "express"
import {
  getItems,
  getItemHandbook,
} from "../controllers/InGameItemController.js"
import {
  getMods,
  getModIds,
  getWeapons,
} from "../controllers/InGameWeaponModController.js"

const router = express.Router()

router.route("/").get(getItems)
router.route("/handbook").get(getItemHandbook)
router.route("/weapons").get(getWeapons)
router.route("/modIds").get(getModIds)
router.route("/mods").get(getMods)

export default router
