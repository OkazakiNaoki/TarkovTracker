import express from "express"

const router = express.Router()

router.route("/").get(getItems)
router.route("/handbook").get(getItemHandbook)

export default router
