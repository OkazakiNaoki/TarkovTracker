import express from "express"
import { protect } from "../middlewares/UserAuth.js"
import {
  addCompleteTask,
  updateCompleteTask,
  getCompleteTask,
  addCompleteTaskObjective,
  updateCompleteTaskObjective,
  getCompleteTaskObjective,
  addTaskObjectiveProgress,
  getTaskObjectiveProgress,
  updateTaskObjectiveProgress,
} from "../controllers/PlayerTaskController.js"

import {
  addTraderLL,
  updateTraderLL,
  getTraderLL,
} from "../controllers/PlayerTraderController.js"

const router = express.Router()

router
  .route("/task/complete")
  .get(protect, getCompleteTask)
  .post(protect, addCompleteTask)
  .put(protect, updateCompleteTask)

router
  .route("/task/objective/progress")
  .get(protect, getTaskObjectiveProgress)
  .post(protect, addTaskObjectiveProgress)
  .put(protect, updateTaskObjectiveProgress)

router
  .route("/task/objective")
  .post(protect, addCompleteTaskObjective)
  .put(protect, updateCompleteTaskObjective)
  .get(protect, getCompleteTaskObjective)

router
  .route("/trader/LL")
  .get(protect, getTraderLL)
  .post(protect, addTraderLL)
  .put(protect, updateTraderLL)

export default router
