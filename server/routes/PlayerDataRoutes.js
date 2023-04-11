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
  getTraderProgress,
  addTraderProgress,
  updateTraderProgress,
  getTraderUnlock,
  addTraderUnlock,
  updateTraderUnlock,
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
import {
  addInventory,
  getInventory,
  updateInventory,
} from "../controllers/PlayerInventoryController.js"
import {
  addSkillProgress,
  getSkillProgress,
  updateSkillProgress,
} from "../controllers/PlayerSkillController.js"
import {
  addUnlockedOffer,
  getUnlockedOffer,
  updateUnlockedOffer,
} from "../controllers/PlayerUnlockedOfferController.js"

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
  .route("/task/objective/complete")
  .post(protect, addCompleteTaskObjective)
  .put(protect, updateCompleteTaskObjective)
  .get(protect, getCompleteTaskObjective)

router
  .route("/trader/LL")
  .get(protect, getTraderProgress)
  .post(protect, addTraderProgress)
  .put(protect, updateTraderProgress)

router
  .route("/trader/unlock")
  .get(protect, getTraderUnlock)
  .post(protect, addTraderUnlock)
  .put(protect, updateTraderUnlock)

router
  .route("/trader/offers")
  .get(protect, getUnlockedOffer)
  .post(protect, addUnlockedOffer)
  .put(protect, updateUnlockedOffer)

router
  .route("/hideout/level")
  .get(protect, getHideoutLevel)
  .post(protect, addHideoutLevel)
  .put(protect, updateHideoutLevel)

router
  .route("/inventory")
  .get(protect, getInventory)
  .post(protect, addInventory)
  .put(protect, updateInventory)

router
  .route("/skill")
  .get(protect, getSkillProgress)
  .post(protect, addSkillProgress)
  .put(protect, updateSkillProgress)

export default router
