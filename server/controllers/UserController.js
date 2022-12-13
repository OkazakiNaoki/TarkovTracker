import asyncHandler from "express-async-handler"
import jwt from "jsonwebtoken"
import User from "../models/UserModel.js"

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" })
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
    res.status(401).send("Account not exist or incorrect password")
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
    res.status(400).send("Email already used by other user")
    return
  } else if (name.length < 8) {
    res.status(400).send("Username too short")
    return
  } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    res.status(400).send("Email format incorrect")
    return
  } else if (password.length < 8) {
    res.status(400).send("Password too short")
    return
  }

  const createdUser = await User.create({ name, email, password })

  if (createdUser) {
    res.status(201).json({
      _id: createdUser._id,
      name: createdUser.name,
      email: createdUser.email,
      token: generateToken(createdUser._id),
    })
  } else {
    res.status(400).send("User creation failed")
  }
})

// @desc Update user password
// @route PUT /api/user/password
// @access private
export const updateUserPassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)

  if (user) {
    if (req.body.password) {
      user.password = req.body.password
    }

    const updateUser = await user.save()
    res.json({
      token: generateToken(updateUser._id),
      msg: "Password successfully changed",
    })
  } else {
    res.status(404)
    throw new Error("User not found")
  }
})
