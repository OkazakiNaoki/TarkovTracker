import asyncHandler from "express-async-handler"
import dotenv from "dotenv"
import axios from "axios"
import * as cheerio from "cheerio"

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

// @desc get update news from BSG official website
// @route GET /api/socialmedia/news/update
// @access public
export const getNewsUpdate = asyncHandler(async (req, res) => {
  const updateListPage = await axios.get(
    "https://www.escapefromtarkov.com/news?page=1&filter=2"
  )

  if (!updateListPage) {
    res.status(404).send("Fail to get update news")
  } else {
    const latestUpdates = []
    let $ = cheerio.load(updateListPage.data)
    $("ul#news-list li div.info div.headtext").each(function (i, parent) {
      latestUpdates.push({
        title: $("a", parent).text(),
        link: $("a", parent).attr("href"),
        date: $("span", parent).text(),
      })
    })
    res.json({
      updateNews: latestUpdates,
    })
  }
})
