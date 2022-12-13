import express from "express"
import { protect } from "../middlewares/UserAuth.js"
import {
  authUser,
  getUserProfile,
  registerUser,
  updateUserPassword,
} from "../controllers/UserController.js"

const router = express.Router()

router.route("/").post(registerUser)
router.post("/login", authUser)
router.route("/profile").get(protect, getUserProfile)
router.route("/password").put(protect, updateUserPassword)

export default router
