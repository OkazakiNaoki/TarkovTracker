import asyncHandler from "express-async-handler"
import InGameItem from "../models/InGameItemModel.js"
import InGameItemCategory from "../models/InGameItemCategoryModel.js"

// @desc Get items
// @route GET /api/items
// @access public
const getItems = asyncHandler(async (req, res) => {
  let limit = 12
  const keyword = req.query.keyword
  const category = req.query.category

  const items = await InGameItem.aggregate([
    {
      $match: {
        name: keyword ? new RegExp(".*" + keyword + ".*", "i") : /(.*?)/,
      },
    },
    {
      $project: {
        _id: 0,
        id: 1,
        name: 1,
        shortName: 1,
        categories: 1,
      },
    },
    {
      $match: {
        categories: {
          $elemMatch: {
            name: category ? category : /(.*?)/,
          },
        },
      },
    },
    {
      $limit: limit,
    },
  ])

  res.json({ items })
})

// @desc Get all item categories
// @route GET /api/items/categories?type=
// @access public
const getItemCategories = asyncHandler(async (req, res) => {
  const type = req.query.type

  if (type === "root") {
    const categories = await InGameItemCategory.aggregate([
      {
        $match: {
          parent: {
            $eq: null,
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
        },
      },
    ])
    res.json({ categories })
  } else if (type === "child") {
    const categories = await InGameItemCategory.aggregate([
      {
        $match: {
          parent: {
            $ne: null,
          },
        },
      },
      {
        $lookup: {
          from: "ingameitemcategories",
          let: { id: "$parent.id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$id"] },
              },
            },
            { $project: { _id: 0, name: 1 } },
          ],

          as: "parentObj",
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          parentName: { $arrayElemAt: ["$parentObj.name", 0] },
        },
      },
    ])
    res.json({ categories })
  } else if (type === "all") {
    const categories = await InGameItemCategory.aggregate([
      {
        $lookup: {
          from: "ingameitemcategories",
          let: { id: "$parent.id" },
          pipeline: [
            {
              $match: {
                $expr: { $eq: ["$$id", "$id"] },
              },
            },
            { $project: { _id: 0, name: 1 } },
          ],

          as: "parentObj",
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          parentName: { $arrayElemAt: ["$parentObj.name", 0] },
        },
      },
      {
        $project: {
          name: 1,
          parentName: {
            $cond: [{ $ifNull: ["$parentName", false] }, "$parentName", null],
          },
        },
      },
    ])
    res.json({ categories })
  }
})

export { getItems, getItemCategories }
