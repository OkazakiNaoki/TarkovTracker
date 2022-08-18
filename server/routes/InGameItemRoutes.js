import express from "express"
import {
  getItem,
  getItemProperties,
  getItemAmmoCaliber,
} from "../controllers/InGameItemController.js"

const router = express.Router()

router.route("/").get(getItem)
router.route("/properties").get(getItemProperties)
router.route("/caliber").get(getItemAmmoCaliber)

export default router
