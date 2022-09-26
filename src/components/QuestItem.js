import React from "react"
import { useEffect } from "react"
import { useState } from "react"
import { Card } from "react-bootstrap"
import { getIndexOfMatchFieldObjArr } from "../helpers/LoopThrough"
import { GainItemMethodBadge } from "./GainItemMethodBadge"
import { ItemSingleGrid } from "./ItemSingleGrid"

const excludeQuest = [
  "61e6e60223374d168a4576a6",
  "61e6e621bfeab00251576265",
  "61e6e5e0f5b9633f6719ed95",
]

const QuestItem = ({ itemReq }) => {
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

  const mouseMoveHandle = (e) => {
    const { clientX, clientY } = e
    setMainX(clientX)
    setMainY(clientY)
  }

  const badgeEnterHandle = () => {
    if (displayGainItemDetail === "none") {
      setDisplayGainItemDetail("block")
    } else {
      setDisplayGainItemDetail("none")
    }
  }

  const badgeHoverHandle = (badge) => {
    setHoverOnBadge(badge)
  }

  useEffect(() => {
    if (hoverOnBadge === "craft") {
      setCurrentInfo(craftInfo)
    } else if (hoverOnBadge === "reward") {
      setCurrentInfo(rewardInfo)
    } else if (hoverOnBadge === "collect") {
      setCurrentInfo("Kappa!!")
    }
  }, [hoverOnBadge])

  useEffect(() => {
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
    const craftStation = itemReq.craftableAt.map((station) => {
      return station.stationName + " level " + station.level + "\n"
    })
    setCraftInfo(craftStation)
  }, [itemReq, isCraftable])

  useEffect(() => {
    const taskReward = itemReq.getFromReward.map((task) => {
      return "x" + task.count + " " + task.trader + "'s " + task.taskName + "\n"
    })
    setRewardInfo(taskReward)
  }, [itemReq, getFromQuestReward])

  return (
    <Card className="bg-dark text-white my-3 p-3 rounded w-100 ls-1">
      <Card.Title
        className="two-line-text-trunc sandbeige"
        style={{ height: "50px" }}
        title={itemReq.item.itemName}
      >
        <strong>{itemReq.item.itemName}</strong>
      </Card.Title>
      <div className="d-flex position-relative my-3 justify-content-center">
        <ItemSingleGrid
          itemId={itemReq.item.itemId}
          foundInRaid={itemReq.item.foundInRaid}
          bgColor={itemReq.item.bgColor}
          shortName={itemReq.item.dogTagLevel ? itemReq.item.dogTagLevel : null}
        />
      </div>
      <div onMouseMove={mouseMoveHandle} style={{ width: "fit-content" }}>
        <GainItemMethodBadge
          craft={isCraftable}
          reward={getFromQuestReward}
          collect={forCollection}
          badgeEnterHandle={badgeEnterHandle}
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
      <Card.Text className="text-center">
        {"- / " +
          itemReq.requiredByTask.reduce((pre, cur) => {
            if (!excludeQuest.includes(cur.taskId)) {
              return pre + cur.count
            } else return pre
          }, 0)}
      </Card.Text>
      <Card.Text>
        {itemReq.requiredByTask.map((req) => {
          if (!excludeQuest.includes(req.taskId)) return req.taskName + " *** "
        })}
      </Card.Text>
      <Card.Text>{itemReq.item.itemId}</Card.Text>
    </Card>
  )
}

export { QuestItem }
