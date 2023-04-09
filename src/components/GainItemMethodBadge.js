import React, { useState, useEffect } from "react"
import { Badge } from "react-bootstrap"
import { getIndexOfObjArrWhereFieldEqualTo } from "../helpers/LoopThrough"

const GainItemMethodBadge = ({
  craftableStations = null,
  questRewards = null,
  collection = null,
  buyables = null,
  barterables = null,
  usePureText = false,
  setTextBoxTextHandle,
  textBadgeEnterHandle,
  textBadgeLeaveHandle,
  tradeBadgeEnterHandle,
  tradeBadgeLeaveHandle,
  taskBadgeEnterHandle,
  taskBadgeLeaveHandle,
  craftBadgeEnterHandle,
  craftBadgeLeaveHandle,
  rewardBadgeEnterHandle,
  rewardBadgeLeaveHandle,
}) => {
  //// state
  const [isCraftable, setIsCraftable] = useState(false)
  const [canGetFromQuestReward, setCanGetFromQuestReward] = useState(false)
  const [isCollection, setIsCollection] = useState(false)
  const [isBuyable, setIsBuyable] = useState(false)
  const [isBarterable, setIsBarterable] = useState(false)
  const [availAtFleaMarket, setAvailAtFleaMarket] = useState(false)

  // text box text
  const [craftText, setCraftText] = useState(null)
  const [rewardText, setRewardText] = useState(null)

  //// effect
  // badge active flags
  useEffect(() => {
    if (craftableStations && craftableStations.length > 0) {
      setIsCraftable(true)
    }
  }, [craftableStations])

  useEffect(() => {
    if (questRewards && questRewards.length > 0) {
      setCanGetFromQuestReward(true)
    }
  }, [questRewards])

  useEffect(() => {
    if (
      collection &&
      getIndexOfObjArrWhereFieldEqualTo(
        collection,
        "id",
        "5c51aac186f77432ea65c552"
      ) !== -1
    ) {
      setIsCollection(true)
    }
  }, [collection])

  useEffect(() => {
    if (buyables && buyables.length > 0) {
      let availFlea = false
      for (let i = 0; i < buyables.length; i++) {
        if (buyables[i].trader === "Flea Market") {
          setAvailAtFleaMarket(true)
          availFlea = true
        }
      }
      if ((availFlea && buyables.length > 1) || !availFlea) {
        setIsBuyable(true)
      }
    }
  }, [buyables])

  useEffect(() => {
    if (barterables && barterables.length > 0) {
      setIsBarterable(true)
    }
  }, [barterables])

  // set text for text box
  useEffect(() => {
    if (usePureText) {
      const craftAtStation = []
      craftableStations &&
        craftableStations.forEach((station) => {
          const stationStr =
            "[Lv." + station.level + "] " + station.station.name + "\n"
          if (!craftAtStation.includes(stationStr)) {
            craftAtStation.push(stationStr)
          }
        })
      setCraftText(craftAtStation)
    }
  }, [craftableStations])

  useEffect(() => {
    if (usePureText) {
      const taskReward = []
      questRewards &&
        questRewards.forEach((task) => {
          taskReward.push(
            "x" + task.count + " [" + task.trader + "] " + task.name + "\n"
          )
        })
      setRewardText(taskReward)
    }
  }, [questRewards])

  return isCraftable ||
    canGetFromQuestReward ||
    isCollection ||
    isBarterable ||
    isBuyable ||
    availAtFleaMarket ? (
    <>
      {isCraftable && (
        <div
          className="d-inline me-2"
          onMouseEnter={() => {
            if (usePureText) {
              setTextBoxTextHandle(craftText)
              textBadgeEnterHandle()
            } else {
              craftBadgeEnterHandle()
            }
          }}
          onMouseLeave={() => {
            if (usePureText) {
              textBadgeLeaveHandle()
            } else {
              craftBadgeLeaveHandle()
            }
          }}
        >
          <Badge pill bg="primary" className="user-select-none">
            craft
          </Badge>
        </div>
      )}
      {canGetFromQuestReward && (
        <div
          className="d-inline me-2"
          onMouseEnter={() => {
            if (usePureText) {
              setTextBoxTextHandle(rewardText)
              textBadgeEnterHandle()
            } else {
              rewardBadgeEnterHandle()
            }
          }}
          onMouseLeave={() => {
            if (usePureText) {
              textBadgeLeaveHandle()
            } else {
              rewardBadgeLeaveHandle()
            }
          }}
        >
          <Badge pill bg="success" className="user-select-none">
            reward
          </Badge>
        </div>
      )}
      {isCollection && (
        <div
          className="d-inline me-2"
          onMouseEnter={() => {
            setTextBoxTextHandle(["Kappa!"])
            textBadgeEnterHandle()
          }}
          onMouseLeave={textBadgeLeaveHandle}
        >
          <Badge pill bg="warning" text="dark" className="user-select-none">
            collect
          </Badge>
        </div>
      )}
      {isBuyable && (
        <div
          className="d-inline me-2"
          onMouseEnter={() => tradeBadgeEnterHandle("buy")}
          onMouseLeave={() => tradeBadgeLeaveHandle("buy")}
        >
          <Badge pill bg="info" text="dark" className="user-select-none">
            buy
          </Badge>
        </div>
      )}
      {isBarterable && (
        <div
          className="d-inline me-2"
          onMouseEnter={() => tradeBadgeEnterHandle("barter")}
          onMouseLeave={() => tradeBadgeLeaveHandle("barter")}
        >
          <Badge pill bg="danger" text="light" className="user-select-none">
            barter
          </Badge>
        </div>
      )}
      {availAtFleaMarket && (
        <div
          className="d-inline me-2"
          onMouseEnter={() => {
            setTextBoxTextHandle(["Flea market"])
            textBadgeEnterHandle()
          }}
          onMouseLeave={textBadgeLeaveHandle}
        >
          <Badge pill bg="light" text="dark" className="user-select-none">
            flea
          </Badge>
        </div>
      )}
    </>
  ) : null
}

export { GainItemMethodBadge }
