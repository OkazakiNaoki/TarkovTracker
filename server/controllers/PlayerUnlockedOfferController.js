import asyncHandler from "express-async-handler"
import PlayerUnlockedOffer from "../models/PlayerUnlockedOfferModel.js"
import InGameUnlockableOffer from "../models/InGameUnlockableOfferModel.js"

// @desc add unlocked offer for a player
// @route POST /api/player/trader/offers
// @access private
export const addUnlockedOffer = asyncHandler(async (req, res) => {
  const existPuo = await PlayerUnlockedOffer.findOne({ user: req.user._id })

  if (!existPuo) {
    const aggregateArr = [
      {
        $project: {
          _id: 0,
        },
      },
    ]

    const unlockedOfferArr = []
    const unlockableOffers = await InGameUnlockableOffer.aggregate(aggregateArr)
    unlockableOffers.forEach((offer) => {
      const o = {
        itemId: offer.offerItem.id,
        trader: offer.offerTrader,
        level: offer.offerTraderLevel,
        unlocked: false,
      }
      unlockedOfferArr.push(o)
    })

    const puo = new PlayerUnlockedOffer({
      user: req.user._id,
      unlockedOffers: unlockedOfferArr,
    })
    const createdPou = await puo.save()
    res.status(201).json(createdPou.unlockedOffers)
  } else {
    res.status(400).send("Exist old unlocked offer data")
  }
})

// @desc update unlocked offer for a player
// @route PUT /api/player/trader/offers
// @access private
export const updateUnlockedOffer = asyncHandler(async (req, res) => {
  const offers = req.body.offers

  if (Array.isArray(offers) && offers.length === 0) {
    res.status(400).send("Offers is empty")
    return
  } else {
    const existPuo = await PlayerUnlockedOffer.findOne({ user: req.user._id })
    if (!existPuo) {
      res.status(404).send("Previous unlocked offer not found")
    } else {
      offers.forEach((offer) => {
        const matchItemIndex = existPuo.unlockedOffers.findIndex((element) => {
          return (
            element.itemId === offer.itemId &&
            element.trader === offer.trader &&
            element.level === offer.level
          )
        })
        if (matchItemIndex === -1) {
          res.status(400).send("No such trade offer")
        } else {
          existPuo.unlockedOffers[matchItemIndex].unlocked = true
        }
      })

      await existPuo.save()
      res.json(offers)
    }
  }
})

// @desc get unlocked offer of a player
// @route GET /api/player/trader/offers
// @access private
export const getUnlockedOffer = asyncHandler(async (req, res) => {
  const puo = await PlayerUnlockedOffer.findOne({ user: req.user._id })
  if (!puo) {
    res.status(404).send("Previous unlocked offer not found")
  } else {
    res.json(puo.unlockedOffers)
  }
})
