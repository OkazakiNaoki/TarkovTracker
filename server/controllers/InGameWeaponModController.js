import asyncHandler from "express-async-handler"
import InGameWeapon from "../models/InGameWeaponModel.js"
import InGameMod from "../models/InGameModModel.js"

// @desc Get weapon by id
// @route GET /api/item/weapon
// @access public
export const getWeapon = asyncHandler(async (req, res) => {
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
      },
    },
  ]

  const weapon = await InGameWeapon.aggregate(aggregateArr)

  res.json(weapon)
})

// @desc Get weapon list
// @route GET /api/items/weapons
// @access public
export const getWeapons = asyncHandler(async (req, res) => {
  const aggregateArr = [
    {
      $project: {
        _id: 0,
        id: 1,
        shortName: 1,
        handbook: "$handbookCategories.name",
        default: "$properties.defaultPreset.id",
      },
    },
  ]

  const weapons = await InGameWeapon.aggregate(aggregateArr)

  res.json(weapons)
})

// @desc Get mod by id
// @route GET /api/item/mod
// @access public
export const getMod = asyncHandler(async (req, res) => {
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
      },
    },
  ]

  const weapon = await InGameMod.aggregate(aggregateArr)

  res.json(weapon)
})

// @desc Get mods id by keyword, handbook category
// @route GET /api/items/modIds
// @access public
export const getModIds = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword
  const handbook = req.query.handbook
  const limit = req.query.limit
    ? Number(req.query.limit) > 30
      ? 30
      : Number(req.query.limit)
    : 30
  const page = Number(req.query.page) || 1

  let skip = limit * (page - 1)

  let handbookMatch = handbook
    ? {
        $match: {
          handbookCategories: {
            $elemMatch: {
              name: handbook,
            },
          },
        },
      }
    : null

  let keywordMatch = keyword
    ? {
        $match: {
          name: new RegExp(".*" + keyword + ".*", "i"),
        },
      }
    : null

  const aggregateArr = []
  if (handbookMatch) {
    aggregateArr.push(handbookMatch)
  }
  if (keywordMatch) {
    aggregateArr.push(keywordMatch)
  }
  aggregateArr.push({
    $project: {
      _id: 0,
      id: 1,
    },
  })

  const mods = await InGameMod.aggregate([
    ...aggregateArr,
    {
      $skip: skip,
    },
    {
      $limit: limit,
    },
  ])
  const allMods = await InGameMod.aggregate([
    ...aggregateArr,
    { $count: "count" },
  ])

  const count = allMods.length !== 0 ? allMods[0].count : 0
  const modIds = mods.map((mod) => mod.id)

  res.json({ modIds, page, pages: Math.ceil(count / limit) })
})

// @desc Get mods by id array
// @route GET /api/items/mods
// @access public
export const getMods = asyncHandler(async (req, res) => {
  const ids = req.query.ids

  const aggregateArr = []
  aggregateArr.push({
    $match: {
      id: {
        $in: ids,
      },
    },
  })
  aggregateArr.push({
    $project: {
      _id: 0,
    },
  })

  const mods = await InGameMod.aggregate(aggregateArr)

  res.json({ mods })
})
