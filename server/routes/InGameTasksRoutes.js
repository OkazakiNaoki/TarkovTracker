import express from "express"
import {
  getTasksOfTrader,
  getTaskById,
  getTaskDescImage,
  getTaskItemRequirements,
} from "../controllers/InGameTaskController.js"

const router = express.Router()

router.route("/").get(getTasksOfTrader)
router.route("/id").get(getTaskById)
router.route("/descimage").get(getTaskDescImage)
router.route("/require/item").get(getTaskItemRequirements)

export default router
