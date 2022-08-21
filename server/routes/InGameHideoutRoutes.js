import express from "express"
import { getHideoutLevels } from "../controllers/InGameHideoutController.js"

const router = express.Router()

router.route("/levels").get(getHideoutLevels)

export default router
