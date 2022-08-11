import express from "express"
import dotenv from "dotenv"
import itemRoutes from "./routes/InGameItemRoutes.js"
import connectDB from "./config/db.js"

dotenv.config()

connectDB()

const app = express()
app.use(express.json())

app.get("/", (req, res) => {
  res.send("API for root")
})

app.use("/api/items", itemRoutes)

const PORT = process.env.PORT || 3030

app.listen(
  PORT,
  console.log(`server listening on port ${PORT}. ${process.env.NODE_ENV} mode`)
)
