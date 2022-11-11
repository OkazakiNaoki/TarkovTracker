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
      itemList: itemList,
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
  const item = req.body.item

  if (item && Object.keys(item).length === 0) {
    res.status(400).send("Item is empty")
    return
  } else {
    const existPi = await PlayerInventory.findOne({ user: req.user._id })
    if (!existPi) {
      res.status(404).send("Previous inventory data not found")
    } else {
      const matchItemIndex = existPi.itemList.findIndex((i) => {
        return i.itemId === item.itemId
      })
      if (matchItemIndex === -1) {
        existPi.itemList.push(item)
      } else {
        if (item.count === 0) {
          existPi.itemList.splice(matchItemIndex, 1)
        } else {
          existPi.itemList[matchItemIndex].count = item.count
          existPi.itemList[matchItemIndex].positionArray = item.positionArray
        }
      }
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
      itemList: pi.itemList,
    })
  }
})
