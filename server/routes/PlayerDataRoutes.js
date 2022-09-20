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
import {
  addCharacterData,
  getCharacterData,
  updateCharacterData,
} from "../controllers/PlayerCharacterDataController.js"
import {
  addHideoutLevel,
  getHideoutLevel,
  updateHideoutLevel,
} from "../controllers/PlayerHideoutController.js"

const router = express.Router()

router
  .route("/character")
  .get(protect, getCharacterData)
  .post(protect, addCharacterData)
  .put(protect, updateCharacterData)

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

router
  .route("/hideout/level")
  .get(protect, getHideoutLevel)
  .post(protect, addHideoutLevel)
  .put(protect, updateHideoutLevel)

export default router
