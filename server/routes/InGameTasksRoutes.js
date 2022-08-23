import express from "express"
import {
  getTasksOfTrader,
  getTaskById,
} from "../controllers/InGameTaskController.js"

const router = express.Router()

router.route("/").get(getTasksOfTrader)
router.route("/id").get(getTaskById)

export default router
