import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"
import User from "../models/UserModel.js"

const ObjectId = mongoose.Types.ObjectId

const protect = asyncHandler(async (req, res, next) => {
  let token

  // use Bearer to auth
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.JWT_SECRET)

      const aggregateArr = [
        {
          $match: {
            _id: ObjectId(`${decoded.id}`),
          },
        },
        {
          $project: {
            name: 1,
            email: 1,
          },
        },
      ]
      const data = await User.aggregate(aggregateArr)
      req.user = data[0]
      next()
    } catch (error) {
      console.error(error)
      res.status(401)
      throw new Error("Not authorized")
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("no token found")
  }
})

const admin = asyncHandler(async (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next()
  } else {
    res.status(401)
    throw new Error("You are not authorized as an admin")
  }
})

export { protect, admin }
