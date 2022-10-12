import express from "express"
import { getYoutubeLatestVideo } from "../controllers/SocialMediaController.js"

const router = express.Router()

router.route("/yt/latest").get(getYoutubeLatestVideo)

export default router
