import express from "express"
import {
  getLevelReqOfTrader,
  getUnlockableOffer,
} from "../controllers/InGameTraderController.js"

const router = express.Router()

router.route("/levels").get(getLevelReqOfTrader)
router.route("/offers").get(getUnlockableOffer)

export default router
