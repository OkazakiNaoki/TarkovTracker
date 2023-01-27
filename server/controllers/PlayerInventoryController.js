import asyncHandler from "express-async-handler"
import PlayerInventory from "../models/PlayerInventoryModel.js"

// @desc add inventory for a player
// @route POST /api/player/inventory
// @access private
export const addInventory = asyncHandler(async (req, res) => {
  const items = req.body.items

  const existPi = await PlayerInventory.findOne({ user: req.user._id })
  if (!existPi) {
    const pi = new PlayerInventory({
      user: req.user._id,
      items: items,
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
  const items = req.body.items

  if (items && Object.keys(items).length === 0) {
    res.status(400).send("Items is empty")
    return
  } else {
    const existPi = await PlayerInventory.findOne({ user: req.user._id })
    if (!existPi) {
      res.status(404).send("Previous inventory data not found")
    } else {
      items.forEach((item) => {
        const matchItemIndex = existPi.items.findIndex((element) => {
          return element.item.id === item.item.id
        })
        if (matchItemIndex === -1 && item.count > 0) {
          existPi.items.push(item)
        } else {
          if (item.count === 0) {
            existPi.items.splice(matchItemIndex, 1)
          } else {
            existPi.items[matchItemIndex].count = item.count
          }
        }
      })

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
      items: pi.items,
    })
  }
})
