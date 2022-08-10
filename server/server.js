import express from "express"
import dotenv from "dotenv"

dotenv.config()

const app = express()

app.get("/", (req, res) => {
  res.send("API for root")
})

app.listen(
  3333,
  console.log(`server listening on port 3333. ${process.env.NODE_ENV} mode`)
)
