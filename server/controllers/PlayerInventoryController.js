import asyncHandler from "express-async-handler"
import PlayerInventory from "../models/PlayerInventoryModel.js"

// @desc add inventory for a player
// @route POST /api/player/inventory
// @access private
export const addInventory = asyncHandler(async (req, res) => {
  const itemList = req.body.itemList

  const existPi = await PlayerInventory.findOne({ user: req.user._id })
  if (!existPi) {
    const pi = new PlayerInventory({
      user: req.user._id,
      ownItemList: itemList,
    })
    const createdPi = await pi.save()
    res.status(201).json(createdPi)
  } else {
    res.status(400).send("Exist old inventory data")
  }
})

// @desc update inventory for a player
// @route PUT /api/player/inventory
// @access private
export const updateInventory = asyncHandler(async (req, res) => {
  const itemList = req.body.itemList

  if (itemList && itemList.length === 0) {
    res.status(400).send("Inventory is empty")
    return
  } else {
    const existPi = await PlayerInventory.findOne({ user: req.user._id })
    if (!existPi) {
      res.status(404).send("Previous inventory data not found")
    } else {
      existPi.ownItemList = itemList
      const updatedPi = await existPi.save()
      res.json(updatedPi)
    }
  }
})

// @desc get inventory of a player
// @route GET /api/player/inventory
// @access private
export const getInventory = asyncHandler(async (req, res) => {
  const pi = await PlayerInventory.findOne({ user: req.user._id })
  if (!pi) {
    res.status(404).send("Previous inventory data not found")
  } else {
    res.json({
      itemList: pi.ownItemList,
    })
  }
})
