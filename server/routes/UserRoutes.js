import express from "express"
import { protect } from "../middlewares/UserAuth.js"
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserProfile,
} from "../controllers/UserController.js"

const router = express.Router()

router.route("/").post(registerUser)
router.post("/login", authUser)
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)

export default router
