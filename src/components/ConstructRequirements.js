import React from "react"
import { HideoutRequirement } from "./HideoutRequirement"
import { ItemRequirement } from "./ItemRequirement"
import { SkillRequirement } from "./SkillRequirement"
import { TraderRequirement } from "./TraderRequirement"
import itemInfoBg from "../../public/static/images/info_window_back.png"

const ConstructRequirements = ({ level }) => {
  return (
    <div
      className="py-3"
      style={{
        backgroundImage: `url(${itemInfoBg})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      {level.stationLevelRequirements.length > 0 && (
        <div className="d-flex justify-content-center mb-5">
          {level.stationLevelRequirements.map((stationReq, i) => {
            return (
              <HideoutRequirement
                key={`station_req_${i}`}
                hideoutId={stationReq.station.id}
                hideoutName={stationReq.station.name}
                level={stationReq.level}
              />
            )
          })}
        </div>
      )}
      {level.itemRequirements.length > 0 && (
        <div className="d-flex justify-content-center mb-5">
          {level.itemRequirements.map((itemReq, i) => {
            return (
              <div className="mx-3" key={`item_req_${i}`}>
                <ItemRequirement
                  itemId={itemReq.item.id}
                  itemName={itemReq.item.name}
                  bgColor={itemReq.item.backgroundColor}
                  reqAmount={itemReq.count}
                  curAmount={2}
                  showFulfill={true}
                />
              </div>
            )
          })}
        </div>
      )}
      {level.traderRequirements.length > 0 && (
        <div className="d-flex justify-content-center mb-5">
          {level.traderRequirements.map((traderReq, i) => {
            return (
              <div className="mx-3" key={`trader_req_${i}`}>
                <TraderRequirement
                  trader={traderReq.trader}
                  standing={traderReq.level}
                />
              </div>
            )
          })}
        </div>
      )}
      {level.skillRequirements.length > 0 && (
        <div className="d-flex justify-content-center mb-5">
          {level.skillRequirements.map((skillReq, i) => {
            return (
              <SkillRequirement
                key={`skill_req_${i}`}
                skillName={skillReq.name}
                level={skillReq.level}
              />
            )
          })}
        </div>
      )}
    </div>
  )
}

export { ConstructRequirements }
