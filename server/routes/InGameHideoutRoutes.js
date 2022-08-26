import express from "express"
import {
  getAllHideoutLevels,
  getHideoutLevels,
} from "../controllers/InGameHideoutController.js"

const router = express.Router()

router.route("/levels").get(getHideoutLevels)
router.route("/levels/all").get(getAllHideoutLevels)

export default router
