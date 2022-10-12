import asyncHandler from "express-async-handler"
import dotenv from "dotenv"
import axios from "axios"

dotenv.config()

// @desc get latest video of BSG youtube channel
// @route GET /api/socialmedia/yt/latest
// @access public
export const getYoutubeLatestVideo = asyncHandler(async (req, res) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  }
  const videoData = await axios.get(
    `https://youtube.googleapis.com/youtube/v3/search?part=id&channelId=UC5QGploHhl9_XaxDiHZKamg&maxResults=1&order=date&key=${process.env.GOOGLE_API_KEY}`,
    config
  )
  if (!videoData) {
    res.status(404).send("Youtube API fail to get the video data")
  } else {
    res.json({
      videoData: videoData.data,
    })
  }
})
