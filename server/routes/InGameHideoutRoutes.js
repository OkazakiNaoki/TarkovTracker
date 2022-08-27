import express from "express"
import {
  getAllHideoutCrafts,
  getAllHideoutLevels,
  getHideoutCraftById,
  getHideoutLevels,
} from "../controllers/InGameHideoutController.js"

const router = express.Router()

router.route("/levels").get(getHideoutLevels)
router.route("/levels/all").get(getAllHideoutLevels)
router.route("/crafts").get(getHideoutCraftById)
router.route("/crafts/all").get(getAllHideoutCrafts)

export default router
