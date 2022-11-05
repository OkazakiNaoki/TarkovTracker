import express from "express"
import { getLevelReqOfTrader } from "../controllers/InGameTraderController.js"

const router = express.Router()

router.route("/levels").get(getLevelReqOfTrader)

export default router
