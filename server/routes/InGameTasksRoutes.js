import express from "express"
import {
  getTasksOfTrader,
  getTaskById,
  getTaskImage,
  getTaskDesc,
  getTaskItemRequirements,
} from "../controllers/InGameTaskController.js"

const router = express.Router()

router.route("/").get(getTasksOfTrader)
router.route("/id").get(getTaskById)
router.route("/image").get(getTaskImage)
router.route("/desc").get(getTaskDesc)
router.route("/require/item").get(getTaskItemRequirements)

export default router
