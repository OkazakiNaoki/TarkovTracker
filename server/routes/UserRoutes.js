import express from "express"
import { protect } from "../middlewares/UserAuth.js"
import {
  addUserPreference,
  authUser,
  getUserPreference,
  getUserProfile,
  registerUser,
  updateUserPassword,
  updateUserPreference,
} from "../controllers/UserController.js"

const router = express.Router()

router.route("/").post(registerUser)
router.post("/login", authUser)
router.route("/profile").get(protect, getUserProfile)
router.route("/password").put(protect, updateUserPassword)

router
  .route("/preference")
  .get(protect, getUserPreference)
  .put(protect, updateUserPreference)
  .post(protect, addUserPreference)

export default router
