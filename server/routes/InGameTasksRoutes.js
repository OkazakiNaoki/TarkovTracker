import express from "express"
import {
  getTasksOfTrader,
  getTaskById,
  getTaskItemRequirements,
  getTaskDetailById,
} from "../controllers/InGameTaskController.js"

const router = express.Router()

router.route("/").get(getTasksOfTrader)
router.route("/id").get(getTaskById)
router.route("/require/item").get(getTaskItemRequirements)
router.route("/detail/id").get(getTaskDetailById)

export default router
