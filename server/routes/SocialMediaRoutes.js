import express from "express"
import {
  getNewsUpdate,
  getYoutubeLatestVideo,
} from "../controllers/SocialMediaController.js"

const router = express.Router()

router.route("/yt/latest").get(getYoutubeLatestVideo)

router.route("/news/update").get(getNewsUpdate)

export default router
