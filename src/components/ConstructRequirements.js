import React, { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  getHideoutLevel,
  getInventoryItem,
  getSkillProgress,
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
  useMeetReq = false,
  setMeetHideoutReq,
  setMeetItemReq,
  setMeetTraderReq,
  setMeetSkillReq,
}) => {
  // redux state
  const { playerHideoutLevel, playerInventory, traderProgress, playerSkill } =
    useSelector((state) => state.character)
  // redux dispatch
  const dispatch = useDispatch()

  // hooks state
  const [stationFulfill, setStationFulfill] = useState(null)
  const [curItemCount, setCurItemCount] = useState(null)
  const [traderFulfill, setTraderFulfill] = useState(null)
  const [skillFulfill, setSkillFulfill] = useState(null)

  // hooks effect
  useEffect(() => {
    if (!playerHideoutLevel) {
      dispatch(getHideoutLevel())
    }
  }, [playerHideoutLevel])

  useEffect(() => {
    if (useMeetReq) {
      let stationFulfillCount = 0
      const fulfillArr = new Array(level.stationLevelRequirements.length).fill(
        false
      )
      if (playerHideoutLevel && level.stationLevelRequirements.length > 0) {
        level.stationLevelRequirements.forEach((stationReq, i) => {
          playerHideoutLevel.some((station) => {
            if (
              station.hideoutId === stationReq.station.id &&
              station.level + 1 >= stationReq.level
            ) {
              fulfillArr[i] = true
              stationFulfillCount += 1
              return true
            }
          })
        })
        setStationFulfill(fulfillArr)
        setMeetHideoutReq(
          stationFulfillCount === level.stationLevelRequirements.length
        )
      } else {
        setMeetHideoutReq(true)
      }
    }
  }, [playerHideoutLevel, level.stationLevelRequirements])

  useEffect(() => {
    if (useMeetReq) {
      let itemFulfillCount = 0
      const itemCountArr = new Array(level.itemRequirements.length).fill(0)
      if (playerInventory && level.itemRequirements.length > 0) {
        level.itemRequirements.forEach((itemReq, i) => {
          playerInventory.some((item) => {
            if (item.itemId === itemReq.item.id) {
              itemCountArr[i] = item.count
              if (item.count >= itemReq.count) {
                itemFulfillCount += 1
              }
              return true
            }
          })
        })
        setCurItemCount(itemCountArr)
        setMeetItemReq(itemFulfillCount === level.itemRequirements.length)
      } else {
        setMeetItemReq(true)
      }
    }
  }, [playerInventory, level.itemRequirements])

  useEffect(() => {
    if (useMeetReq) {
      let traderFulfillCount = 0
      const fulfillArr = new Array(level.traderRequirements.length).fill(false)
      if (traderProgress && level.traderRequirements.length > 0) {
        level.traderRequirements.forEach((traderReq, i) => {
          if (
            traderProgress.traderLL[traderReq.trader.name] >= traderReq.level
          ) {
            fulfillArr[i] = true
            traderFulfillCount += 1
          }
        })
        setTraderFulfill(fulfillArr)
        setMeetTraderReq(traderFulfillCount === level.traderRequirements.length)
      } else {
        setMeetTraderReq(true)
      }
    }
  }, [traderProgress, level.traderRequirements])

  useEffect(() => {
    if (useMeetReq) {
      let skillFulfillCount = 0
      const fulfillArr = new Array(level.skillRequirements.length).fill(false)
      if (playerSkill && level.skillRequirements.length > 0) {
        level.skillRequirements.forEach((skillReq, i) => {
          playerSkill.skills.some((skill) => {
            if (skill.skillName === skillReq.name) {
              if (skill.level >= skillReq.level) {
                fulfillArr[i] = true
                skillFulfillCount += 1
                return true
              }
            }
          })
        })
        setSkillFulfill(fulfillArr)
        setMeetSkillReq(skillFulfillCount === level.skillRequirements.length)
      } else {
        setMeetSkillReq(true)
      }
    }
  }, [playerSkill, level.skillRequirements])

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

  useEffect(() => {
    if (!playerSkill) {
      dispatch(getSkillProgress())
    }
  }, [playerSkill])

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
            return (
              <HideoutRequirement
                key={`station_req_${i}`}
                hideoutId={stationReq.station.id}
                hideoutName={stationReq.station.name}
                level={stationReq.level}
                showFulfill={showFulfill}
                fulfill={stationFulfill && stationFulfill[i]}
              />
            )
          })}
        </div>
      )}
      {level.itemRequirements.length > 0 && (
        <div className="d-flex justify-content-center flex-wrap mb-5">
          {level.itemRequirements.map((itemReq, i) => {
            return (
              <div className="mx-3" key={`item_req_${i}`}>
                <ItemRequirement
                  itemId={itemReq.item.id}
                  itemName={itemReq.item.name}
                  bgColor={itemReq.item.backgroundColor}
                  reqAmount={itemReq.count}
                  curAmount={curItemCount && curItemCount[i]}
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
            return (
              <div className="mx-3" key={`trader_req_${i}`}>
                <TraderRequirement
                  trader={traderReq.trader}
                  standing={traderReq.level}
                  showFulfill={showFulfill}
                  fulfill={traderFulfill && traderFulfill[i]}
                />
              </div>
            )
          })}
        </div>
      )}
      {level.skillRequirements.length > 0 && (
        <div className="d-flex justify-content-center flex-wrap mb-5">
          {level.skillRequirements.map((skillReq, i) => {
            return (
              <SkillRequirement
                key={`skill_req_${i}`}
                skillName={skillReq.name}
                level={skillReq.level}
                useNameBox={true}
                showFulfill={showFulfill}
                fulfill={skillFulfill && skillFulfill[i]}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export { ConstructRequirements }
