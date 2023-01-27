import express from "express"
import {
  getItems,
  getItemHandbook,
} from "../controllers/InGameItemController.js"

const router = express.Router()

router.route("/").get(getItems)
router.route("/handbook").get(getItemHandbook)

export default router
