import express from "express"
import { getItem } from "../controllers/InGameItemController.js"

const router = express.Router()

router.route("/").get(getItem)

export default router
