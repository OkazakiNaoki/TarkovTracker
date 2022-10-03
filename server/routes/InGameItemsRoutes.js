import express from "express"
import {
  getItems,
  getItemCategories,
  getItemHandbook,
} from "../controllers/InGameItemController.js"

const router = express.Router()

router.route("/").get(getItems)
router.route("/categories").get(getItemCategories)
router.route("/handbook").get(getItemHandbook)

export default router
