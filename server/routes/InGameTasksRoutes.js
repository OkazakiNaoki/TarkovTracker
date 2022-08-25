import express from "express"
import {
  getTasksOfTrader,
  getTaskById,
  getTaskImage,
  getTaskDesc,
} from "../controllers/InGameTaskController.js"

const router = express.Router()

router.route("/").get(getTasksOfTrader)
router.route("/id").get(getTaskById)
router.route("/image").get(getTaskImage)
router.route("/desc").get(getTaskDesc)

export default router
