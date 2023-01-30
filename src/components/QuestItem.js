import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Button, Card, Placeholder } from "react-bootstrap"
import { useDispatch } from "react-redux"
import {
  getAnotherFieldOfMatchFieldObjArr,
  getIndexOfMatchFieldObjArr,
} from "../helpers/LoopThrough"
import {
  addInventoryItem,
  updateInventoryItem,
} from "../reducers/CharacterSlice"
import { EditValueModal } from "./EditValueModal"
import { DivLoading } from "./DivLoading"
import { FloatingMessageBox } from "./FloatingMessageBox"
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
  const [itemCount, setItemCount] = useState(null)
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
        "item.id",
        itemReq.item.id,
        "count"
      )
      if (count !== itemCount) setItemCount(count)
    }
  }, [playerInventory])

  useEffect(() => {
    // update player's inventory once own amount of quest item changed
    if (playerInventory && itemCount !== null) {
      const newInventory = JSON.parse(JSON.stringify(playerInventory))
      const index = getIndexOfMatchFieldObjArr(
        newInventory,
        "id",
        itemReq.item.id
      )
      if (index === -1 || newInventory[index].count !== itemCount) {
        dispatch(
          updateInventoryItem({
            items: [
              {
                item: {
                  id: itemReq.item.id,
                  name: itemReq.item.name,
                  backgroundColor: itemReq.item.backgroundColor,
                },
                count: itemCount,
              },
            ],
          })
        )
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
    <FloatingMessageBox
      key="msg_box"
      posX={mainX}
      posY={mainY}
      display={displayGainItemDetail}
      content={currentInfo}
    />,
    <EditValueModal
      title={itemReq.item.itemName}
      key="modal_of_item_count"
      show={itemModalOnOff}
      value={itemCount ?? 0}
      maxValue={itemNeedTotalCount}
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
        title={itemReq.item.name}
      >
        <strong>{itemReq.item.name}</strong>
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
            itemId={itemReq.item.id}
            foundInRaid={itemReq.item.foundInRaid}
            bgColor={itemReq.item.backgroundColor}
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
      <Card.Text className="text-center my-3">
        {(itemCount ?? 0) + " / " + itemNeedTotalCount}
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
