import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../models/UserModel.js"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" })
}

// @desc Auth user and get token
// @route POST /api/user/login
// @access public
export const authUser = asyncHandler(async (req, res) => {
  const email = req.body.email
  const password = req.body.password

  const user = await User.findOne({ email })

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    })
  } else {
    res.status(401)
    throw new Error("No such email or password")
  }
})

// @desc Get user profile
// @route GET /api/user/profile
// @access private
export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})

// @desc Register new user
// @route POST /api/user
// @access public
export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  const existUser = await User.findOne({ email })

  if (existUser) {
    res.status(400)
    throw new Error("User email already used")
  } else {
    const createdUser = await User.create({ name, email, password })

    if (createdUser) {
      res.status(201).json({
        _id: createdUser._id,
        name: createdUser.name,
        email: createdUser.email,
        token: generateToken(createdUser._id),
      })
    } else {
      res.status(400)
      throw new Error("User creation failed")
    }
  }
})

// @desc Update user profile
// @route PUT /api/user/profile
// @access private
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userEmailExists = await User.findOne({ email: req.body.email })
  const user = await User.findById(req.user._id)
  if (userEmailExists && req.body.email !== user.email) {
    res.status(400) //bad request
    throw new Error("Email already in use")
  } else {
    if (user) {
      user.name = req.body.name || user.name
      user.email = req.body.email || user.email
      if (req.body.password) {
        user.password = req.body.password
      }

      const updateUser = await user.save()
      res.json({
        _id: updateUser._id,
        name: updateUser.name,
        email: updateUser.email,
        token: generateToken(updateUser._id),
      })
    } else {
      res.status(404)
      throw new Error("User not found")
    }
  }
})
