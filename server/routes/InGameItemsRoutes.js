import express from "express"
import {
  getItems,
  getItemCategories,
} from "../controllers/InGameItemController.js"

const router = express.Router()

router.route("/").get(getItems)
router.route("/categories").get(getItemCategories)

export default router
