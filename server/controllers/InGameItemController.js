import asyncHandler from "express-async-handler"
import InGameItem from "../models/InGameItemModel.js"
import InGameItemCategory from "../models/InGameItemCategoryModel.js"
import InGameItemHandbook from "../models/InGameItemHandbookModel.js"
import InGameItemProperty from "../models/InGameItemPropertyModel.js"
import InGaneItemAmmoCaliber from "../models/InGameItemAmmoCaliberModel.js"

// @desc Get items
// @route GET /api/items
// @access public
export const getItems = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
  const handbook = req.query.handbook
  const limit = req.query.limit
    ? Number(req.query.limit) > 12
      ? 12
      : Number(req.query.limit)
    : 12
  const page = Number(req.query.page) || 1

  const handbookArr = handbook ? JSON.parse(handbook) : null

  let skip = limit * (page - 1)

  const aggregateArr = [
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
        handbookCategories: 1,
        width: 1,
        height: 1,
        backgroundColor: 1,
      },
    },
    {
      $match: {
        handbookCategories: {
          $in: handbookArr ? [...handbookArr] : [/(.*?)/],
        },
      },
    },
    {
      $sort: {
        name: 1,
      },
    },
  ]

  const items = await InGameItem.aggregate([
    ...aggregateArr,
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ])
  const noLimitItems = await InGameItem.aggregate([
    ...aggregateArr,
    { $count: "count" },
  ])

  const count = noLimitItems.length !== 0 ? noLimitItems[0].count : 0

  res.json({ items, page, pages: Math.ceil(count / limit) })
})

// @desc Get items
// @route GET /api/items
// @access public
export const getItem = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
  const id = req.query.id
  const name = req.query.name

  const aggregateArr = [
    {
      $match: {
        id: id ? id : /(.*?)/,
        name: id ? /(.*?)/ : name,
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
  ]

  const item = await InGameItem.aggregate(aggregateArr)

  res.json(item)
})

// @desc Get items properties
// @route GET /api/item/properties
// @access public
export const getItemProperties = asyncHandler(async (req, res) => {
  const category = req.query.category

  const aggregateArr = [
    {
      $match: {
        category: category,
      },
    },
    {
      $project: {
        _id: 0,
        category: 1,
        propertyUnion: 1,
        properties: 1,
        additionalProperty: 1,
        propertyRename: 1,
      },
    },
  ]

  const item = await InGameItemProperty.aggregate(aggregateArr)

  res.json(item)
})

// @desc Get items properties
// @route GET /api/item/caliber
// @access public
export const getItemAmmoCaliber = asyncHandler(async (req, res) => {
  const caliber = req.query.caliber

  const aggregateArr = [
    {
      $match: {
        caliber: caliber,
      },
    },
    {
      $project: {
        _id: 0,
        ammunition: 1,
      },
    },
  ]

  const item = await InGaneItemAmmoCaliber.aggregate(aggregateArr)

  res.json(item)
})

// @desc Get all item categories
// @route GET /api/items/categories?type=
// @access public
export const getItemCategories = asyncHandler(async (req, res) => {
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

// @desc Get all item handbook categories
// @route GET /api/items/handbook?type=
// @access public
export const getItemHandbook = asyncHandler(async (req, res) => {
  const type = req.query.type

  if (type === "root") {
    const handbook = await InGameItemHandbook.aggregate([
      {
        $match: {
          handbookCategoryParent: {
            $eq: null,
          },
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
        },
      },
    ])
    res.json({ handbook })
  } else if (type === "child") {
    const handbook = await InGameItemHandbook.aggregate([
      {
        $match: {
          handbookCategoryParent: {
            $ne: null,
          },
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
        },
      },
    ])
    res.json({ handbook })
  } else if (type === "all") {
    const handbook = await InGameItemHandbook.aggregate([
      {
        $project: {
          _id: 0,
          __v: 0,
        },
      },
    ])
    res.json({ handbook })
  }
})
