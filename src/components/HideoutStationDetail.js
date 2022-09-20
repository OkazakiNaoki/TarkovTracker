import React from "react"
import { TarkovStyleButton } from "./TarkovStyleButton"

const HideoutStationDetail = ({
  station,
  level,
  nextLevel,
  increaseLevelHandle,
  canConstruct = false,
}) => {
  return (
    <div className="my-3 p-2" style={{ border: "1px solid white" }}>
      {!canConstruct && (
        <h2 className="text-center">{"Level " + level.level}</h2>
      )}
      <p className="text-center pb-4">{level.description}</p>
      {canConstruct &&
        nextLevel &&
        (nextLevel.itemRequirements.length > 0 ||
          nextLevel.skillRequirements.length > 0 ||
          nextLevel.stationLevelRequirements.length > 0 ||
          nextLevel.traderRequirements.length > 0) && [
          <p key="construct_heading" className="text-center fs-3">
            CONSTRUCTION REQUIREMENTS
          </p>,
          <div
            key="construct_reqs"
            className="d-flex justify-content-center mb-5"
          >
            {nextLevel.itemRequirements.map((itemReq) => {
              return itemReq.item.name + "  x" + itemReq.count + "\n"
            })}
            {nextLevel.skillRequirements.map((skillReq) => {
              return skillReq.name + " level " + skillReq.level + "\n"
            })}
            {nextLevel.stationLevelRequirements.map((stationReq) => {
              return (
                stationReq.station.name + " level " + stationReq.level + "\n"
              )
            })}
            {nextLevel.traderRequirements.map((traderReq) => {
              return traderReq.trader.name + " level " + traderReq.level + "\n"
            })}
          </div>,
        ]}

      {!canConstruct &&
        level.crafts.length > 0 && [
          <p key="craft_heading" className="text-center fs-3">
            PRODUCTION
          </p>,
          <div key="crafts">
            {station.levels.map((lvl) => {
              return lvl.crafts.map((c, i) => {
                if (lvl.level <= level.level)
                  return (
                    <div
                      key={station.name + c.level + "craft_" + i}
                      className="text-center"
                    >
                      {c.duration}
                      {c.requiredItems.map((itemReq, i) => {
                        return (
                          <div key={"itemReq_" + i}>
                            {itemReq.item.name + "  x" + itemReq.count + "\n"}
                          </div>
                        )
                      })}
                      {c.rewardItems.map((itemRew) => {
                        return (
                          <div key={"itemRew_" + i}>
                            {itemRew.item.name + "  x" + itemRew.count + "\n"}
                          </div>
                        )
                      })}
                    </div>
                  )
              })
            })}
          </div>,
        ]}
      {canConstruct && (
        <TarkovStyleButton
          text="CONSTRUCT"
          clickHandle={increaseLevelHandle}
          height={50}
        />
      )}
      {!canConstruct &&
        nextLevel && [
          <TarkovStyleButton
            key="upgradeable_back"
            text="BACK"
            clickHandle={() => {}}
            height={50}
          />,
          <TarkovStyleButton
            key="upgradeable_upgrade"
            text="UPGRADE"
            clickHandle={increaseLevelHandle}
            height={50}
          />,
        ]}
    </div>
  )
}

export { HideoutStationDetail }
