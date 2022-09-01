import express from "express"
import { protect } from "../middlewares/UserAuth.js"
import {
  addCompleteTask,
  updateCompleteTask,
  getCompleteTask,
} from "../controllers/PlayerTaskController.js"

const router = express.Router()

router
  .route("/task/complete")
  .get(protect, getCompleteTask)
  .post(protect, addCompleteTask)
  .put(protect, updateCompleteTask)

export default router
