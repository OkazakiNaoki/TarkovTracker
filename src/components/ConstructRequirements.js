import React from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getHideoutLevel,
  getInventoryItem,
  getTraderProgress,
} from "../reducers/CharacterSlice"
import { HideoutRequirement } from "./HideoutRequirement"
import { ItemRequirement } from "./ItemRequirement"
import { SkillRequirement } from "./SkillRequirement"
import { TraderRequirement } from "./TraderRequirement"
import itemInfoBg from "../../public/static/images/info_window_back.png"
import { useEffect } from "react"

const ConstructRequirements = ({
  level,
  showFulfill = false,
  setMeetHideoutReq,
  setMeetItemReq,
  setMeetTraderReq,
  setMeetSkillReq,
}) => {
  // redux state
  const { playerHideoutLevel, playerInventory, traderProgress } = useSelector(
    (state) => state.character
  )
  // redux dispatch
  const dispatch = useDispatch()

  // hooks effect
  useEffect(() => {
    if (!playerHideoutLevel) {
      dispatch(getHideoutLevel())
    }
  }, [playerHideoutLevel])

  useEffect(() => {
    if (!playerInventory) {
      dispatch(getInventoryItem())
    }
  }, [playerInventory])

  useEffect(() => {
    if (!traderProgress) {
      dispatch(getTraderProgress())
    }
  }, [traderProgress])

  let hideoutFulfillCount = 0
  let itemFulfillCount = 0
  let traderFulfillCount = 0

  return (
    <div
      className="py-3 w-100"
      style={{
        backgroundImage: `url(${itemInfoBg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {level.stationLevelRequirements.length > 0 && (
        <div className="d-flex justify-content-center flex-wrap mb-5">
          {level.stationLevelRequirements.map((stationReq, i) => {
            let fulfill = false
            if (playerHideoutLevel) {
              playerHideoutLevel.forEach((station) => {
                if (
                  station.hideoutId === stationReq.station.id &&
                  station.level + 1 >= stationReq.level
                ) {
                  fulfill = true
                  hideoutFulfillCount += 1
                }
              })
            }
            if (hideoutFulfillCount === level.stationLevelRequirements.length) {
              setMeetHideoutReq(true)
            }
            return (
              <HideoutRequirement
                key={`station_req_${i}`}
                hideoutId={stationReq.station.id}
                hideoutName={stationReq.station.name}
                level={stationReq.level}
                showFulfill={showFulfill}
                fulfill={fulfill}
              />
            )
          })}
        </div>
      )}
      {level.itemRequirements.length > 0 && (
        <div className="d-flex justify-content-center flex-wrap mb-5">
          {level.itemRequirements.map((itemReq, i) => {
            let fulfill = false
            let itemOwnCount = 0
            if (playerInventory) {
              playerInventory.forEach((item) => {
                if (item.itemId === itemReq.item.id) {
                  itemOwnCount = item.count
                  if (item.count >= itemReq.count) {
                    fulfill = true
                    itemFulfillCount += 1
                  }
                }
              })
            }
            if (itemFulfillCount === level.itemRequirements.length) {
              setMeetItemReq(true)
            }
            return (
              <div className="mx-3" key={`item_req_${i}`}>
                <ItemRequirement
                  itemId={itemReq.item.id}
                  itemName={itemReq.item.name}
                  bgColor={itemReq.item.backgroundColor}
                  reqAmount={itemReq.count}
                  curAmount={itemOwnCount}
                  showFulfill={showFulfill}
                />
              </div>
            )
          })}
        </div>
      )}
      {level.traderRequirements.length > 0 && (
        <div className="d-flex justify-content-center flex-wrap mb-5">
          {level.traderRequirements.map((traderReq, i) => {
            let fulfill = false
            if (
              traderProgress &&
              traderProgress.traderLL[traderReq.trader.name] >= traderReq.level
            ) {
              fulfill = true
              traderFulfillCount += 1
            }
            if (traderFulfillCount === level.traderRequirements.length) {
              setMeetTraderReq(true)
            }
            return (
              <div className="mx-3" key={`trader_req_${i}`}>
                <TraderRequirement
                  trader={traderReq.trader}
                  standing={traderReq.level}
                  showFulfill={showFulfill}
                  fulfill={fulfill}
                />
              </div>
            )
          })}
        </div>
      )}
      {level.skillRequirements.length > 0 && (
        <div className="d-flex justify-content-center flex-wrap mb-5">
          {level.skillRequirements.map((skillReq, i) => {
            setMeetSkillReq(false)
            return (
              <SkillRequirement
                key={`skill_req_${i}`}
                skillName={skillReq.name}
                level={skillReq.level}
                useNameBox={true}
                showFulfill={showFulfill}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export { ConstructRequirements }
