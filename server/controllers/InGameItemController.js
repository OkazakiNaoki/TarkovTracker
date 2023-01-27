import asyncHandler from "express-async-handler"
import InGameItem from "../models/InGameItemModel.js"
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

  let match = keyword
    ? {
        name: new RegExp(".*" + keyword + ".*", "i"),
      }
    : {
        _id: { $exists: true },
      }

  const aggregateArr = [
    {
      $match: match,
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
          $elemMatch: {
            name: {
              $in: handbookArr ? [...handbookArr] : [/(.*?)/],
            },
          },
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
// @route GET /api/item
// @access public
export const getItem = asyncHandler(async (req, res) => {
  const id = req.query.id

  const aggregateArr = [
    {
      $match: {
        id: id,
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
        category: {
          $in: [category],
        },
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

// @desc Get all item handbook categories
// @route GET /api/items/handbook
// @access public
export const getItemHandbook = asyncHandler(async (req, res) => {
  const handbook = await InGameItemHandbook.aggregate([
    {
      $project: {
        _id: 0,
      },
    },
  ])
  res.json({ handbook })
})
