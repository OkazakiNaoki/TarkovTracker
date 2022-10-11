import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Button, Card, Placeholder } from "react-bootstrap"
import { useDispatch } from "react-redux"
import {
  getAnotherFieldOfMatchFieldObjArr,
  getIndexOfMatchFieldObjArr,
} from "../helpers/LoopThrough"
import { updateInventoryItem } from "../reducers/CharacterSlice"
import { AddValueModal } from "./AddValueModal"
import { DivLoading } from "./DivLoading"
import { GainItemMethodBadge } from "./GainItemMethodBadge"
import { ItemSingleGrid } from "./ItemSingleGrid"

const excludeQuest = [
  "61e6e60223374d168a4576a6",
  "61e6e621bfeab00251576265",
  "61e6e5e0f5b9633f6719ed95",
]

const QuestItem = ({ playerInventory, itemReq }) => {
  const [mainX, setMainX] = useState(0)
  const [mainY, setMainY] = useState(0)
  const [displayGainItemDetail, setDisplayGainItemDetail] = useState("none")
  const [isCraftable, setIsCraftable] = useState(false)
  const [getFromQuestReward, setGetFromQuestReward] = useState(false)
  const [forCollection, setForCollection] = useState(false)
  const [craftInfo, setCraftInfo] = useState(null)
  const [rewardInfo, setRewardInfo] = useState(null)
  const [hoverOnBadge, setHoverOnBadge] = useState(null)
  const [currentInfo, setCurrentInfo] = useState(null)
  const [neededQuestInfo, setNeededQuestInfo] = useState(null)
  const [itemCount, setItemCount] = useState(0)
  const [itemNeedTotalCount, setItemNeedTotalCount] = useState(0)
  const [itemModalOnOff, setItemModalOnOff] = useState(false)

  const mouseMoveHandle = (e) => {
    const { clientX, clientY } = e
    setMainX(clientX)
    setMainY(clientY)
  }

  const badgeEnterHandle = () => {
    setDisplayGainItemDetail("block")
  }

  const badgeLeaveHandle = () => {
    setDisplayGainItemDetail("none")
  }

  const badgeHoverHandle = (badge) => {
    setHoverOnBadge(badge)
  }

  const openItemCountModal = () => {
    setItemModalOnOff(!itemModalOnOff)
  }

  // redux
  const dispatch = useDispatch()

  useEffect(() => {
    // calculate total requirement amount of quest item
    if (itemNeedTotalCount === 0) {
      setItemNeedTotalCount(
        itemReq.requiredByTask.reduce((pre, cur) => {
          if (!excludeQuest.includes(cur.taskId)) {
            return pre + cur.count
          } else return pre
        }, 0)
      )
    }
  }, [itemNeedTotalCount])

  useEffect(() => {
    if (playerInventory) {
      const count = getAnotherFieldOfMatchFieldObjArr(
        playerInventory,
        "itemId",
        itemReq.item.itemId,
        "count"
      )
      if (count !== itemCount) setItemCount(count)
    }
  }, [playerInventory])

  useEffect(() => {
    // update player's inventory once own amount of quest item changed
    if (playerInventory) {
      const newInventory = JSON.parse(JSON.stringify(playerInventory))
      const index = getIndexOfMatchFieldObjArr(
        newInventory,
        "itemId",
        itemReq.item.itemId
      )
      if (index !== -1 && newInventory[index].count !== itemCount) {
        newInventory[index].count = itemCount
        dispatch(updateInventoryItem({ itemList: newInventory }))
      }
    }
  }, [itemCount])

  useEffect(() => {
    if (hoverOnBadge === "needed") {
      setCurrentInfo(neededQuestInfo)
    } else if (hoverOnBadge === "craft") {
      setCurrentInfo(craftInfo)
    } else if (hoverOnBadge === "reward") {
      setCurrentInfo(rewardInfo)
    } else if (hoverOnBadge === "collect") {
      setCurrentInfo("Kappa!!")
    }
  }, [hoverOnBadge])

  useEffect(() => {
    // setup label of quest item
    if (itemReq.craftableAt.length > 0) {
      setIsCraftable(true)
    }
    if (itemReq.getFromReward.length > 0) {
      setGetFromQuestReward(true)
    }
    if (
      getIndexOfMatchFieldObjArr(
        itemReq.requiredByTask,
        "taskId",
        "5c51aac186f77432ea65c552"
      ) !== -1
    ) {
      setForCollection(true)
    }
  }, [itemReq])

  useEffect(() => {
    // set text for infobox (craft)
    const craftStation = itemReq.craftableAt.map((station) => {
      return station.stationName + " level " + station.level + "\n"
    })
    setCraftInfo(craftStation)
  }, [itemReq, isCraftable])

  useEffect(() => {
    // set text for infobox (reward)
    const taskReward = itemReq.getFromReward.map((task) => {
      return "x" + task.count + " " + task.trader + "'s " + task.taskName + "\n"
    })
    setRewardInfo(taskReward)
  }, [itemReq, getFromQuestReward])

  useEffect(() => {
    // set text for infobox (needed)
    const neededQuest = itemReq.requiredByTask.map((req) => {
      if (!excludeQuest.includes(req.taskId))
        return req.trader + "'s " + req.taskName + "\n"
    })
    setNeededQuestInfo(neededQuest)
  }, [itemReq])

  return [
    <AddValueModal
      title={itemReq.item.itemName}
      key="modal_of_item_count"
      show={itemModalOnOff}
      value={itemCount}
      valueCap={itemNeedTotalCount}
      setValueHandle={(v) => {
        setItemCount(v)
        openItemCountModal()
      }}
      closeHandle={openItemCountModal}
    />,
    <Card
      key="quest_item_card"
      className="bg-dark text-white my-3 rounded w-100 ls-1"
    >
      <Card.Title
        className="p-3 two-line-text-trunc sandbeige"
        style={{ height: "68px" }}
        title={itemReq.item.itemName}
      >
        <strong>{itemReq.item.itemName}</strong>
      </Card.Title>
      <div className="px-3" style={{ fontSize: "8px" }}>
        {itemReq.item.shortName}
      </div>
      <div className="d-flex position-relative my-3 justify-content-center">
        <div
          onMouseOver={() => {
            badgeHoverHandle("needed")
          }}
          onMouseEnter={badgeEnterHandle}
          onMouseLeave={badgeLeaveHandle}
          onMouseMove={mouseMoveHandle}
          style={{ width: "64px", height: "64px" }}
        >
          <ItemSingleGrid
            itemId={itemReq.item.itemId}
            foundInRaid={itemReq.item.foundInRaid}
            bgColor={itemReq.item.bgColor}
            shortName={
              itemReq.item.dogTagLevel ? itemReq.item.dogTagLevel : null
            }
          />
        </div>
      </div>
      <div onMouseMove={itemReq ? mouseMoveHandle : null} className="px-3">
        <GainItemMethodBadge
          craft={isCraftable}
          reward={getFromQuestReward}
          collect={forCollection}
          badgeEnterHandle={badgeEnterHandle}
          badgeLeaveHandle={badgeLeaveHandle}
          badgeHoverHandle={badgeHoverHandle}
        />
      </div>
      <div
        style={{
          position: "fixed",
          left: mainX,
          top: mainY,
          display: displayGainItemDetail,
          userSelect: "none",
          transform: "translateX(10px) translateY(-100%)",
          backgroundColor: "#fff",
          zIndex: "100001",
        }}
      >
        <div
          className="py-1 px-2"
          style={{
            backgroundColor: "#000",
            border: "2px solid #585d60",
            whiteSpace: "break-spaces",
          }}
        >
          {currentInfo}
        </div>
      </div>
      <Card.Text className="text-center my-3">
        {itemCount + " / " + itemNeedTotalCount}
      </Card.Text>
      <div className="d-flex flex-grow-1 justify-content-center">
        {playerInventory && (
          <Button
            variant="secondary"
            onClick={openItemCountModal}
            className="align-self-end w-100"
            style={{ borderRadius: "0 0 0.374rem 0.374rem" }}
          >
            +
          </Button>
        )}
      </div>
    </Card>,
  ]
}

export { QuestItem }
