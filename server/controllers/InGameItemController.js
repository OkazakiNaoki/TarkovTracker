import asyncHandler from "express-async-handler"
import InGameItem from "../models/InGameItemModel.js"
import InGameItemCategory from "../models/InGameItemCategoryModel.js"

// @desc Get items
// @route GET /api/items
// @access public
const getItems = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
    ? {
        name: { $regex: req.query.keyword, $options: "i" },
      }
    : {}

  const items = await InGameItem.find({ ...keyword }).limit(10)

  res.json({ items })
})

// @desc Get all item categories
// @route GET /api/items/categories
// @access public
const getItemCategories = asyncHandler(async (req, res) => {
  const categories = await InGameItemCategory.find({})

  res.json({ categories })
})

export { getItems, getItemCategories }
