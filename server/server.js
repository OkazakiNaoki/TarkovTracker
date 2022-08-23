import express from "express"
import dotenv from "dotenv"
import itemsRoutes from "./routes/InGameItemsRoutes.js"
import itemRoutes from "./routes/InGameItemRoutes.js"
import hideoutRoutes from "./routes/InGameHideoutRoutes.js"
import taskRoutes from "./routes/InGameTasksRoutes.js"
import connectDB from "./config/db.js"
import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

dotenv.config()

connectDB()

const app = express()
app.use(express.json())

// icon image asset
app.use("/asset", express.static(join(__dirname, "public/images/item-icons")))
app.use("/asset", express.static(join(__dirname, "public/images/trader-icons")))

app.use("/api/items", itemsRoutes)
app.use("/api/item", itemRoutes)
app.use("/api/hideout", hideoutRoutes)
app.use("/api/task", taskRoutes)

const PORT = process.env.PORT || 3030
app.listen(
  PORT,
  console.log(`server listening on port ${PORT}. ${process.env.NODE_ENV} mode`)
)
