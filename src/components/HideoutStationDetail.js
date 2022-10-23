import React, { useState } from "react"
import { ConstructRequirements } from "./ConstructRequirements"
import { HideoutIcon } from "./HideoutIcon"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { TextStroke } from "./TextStroke"

const HideoutStationDetail = ({
  station,
  curLevelIndex,
  nextLevelIndex,
  increaseLevelHandle,
}) => {
  const [showUpgrade, setShowUpgrade] = useState(false)

  const showUpgradeHandle = () => {
    setShowUpgrade(!showUpgrade)
  }

  return (
    <div className="my-3" style={{ border: "1px solid white" }}>
      {/* heading */}
      <div
        className="d-flex align-items-center"
        style={{ backgroundColor: "#191919" }}
      >
        <HideoutIcon
          iconName={station.id}
          level={curLevelIndex + 1}
          noHover={true}
        />
        <TextStroke
          fontSize={40}
          strokeWidth={6}
          content={station.name}
          color="#edebd6"
        />
      </div>
      {/* inner */}
      {/* station description */}
      <p
        className="mx-3 mt-3 mb-5"
        style={{
          fontFamily: "TarkovItalic",
          color: "#9ea8ad",
          lineHeight: "1.2",
        }}
      >
        {station.levels[curLevelIndex !== -1 ? curLevelIndex : 0].description}
      </p>
      {/* station construct/upgrade requirement */}
      {(curLevelIndex === -1 || showUpgrade) &&
        station.levels[nextLevelIndex] &&
        (station.levels[nextLevelIndex].itemRequirements.length > 0 ||
          station.levels[nextLevelIndex].skillRequirements.length > 0 ||
          station.levels[nextLevelIndex].stationLevelRequirements.length > 0 ||
          station.levels[nextLevelIndex].traderRequirements.length > 0) && (
          <>
            <p className="text-center fs-3 mb-0" style={{ color: "#edebd6" }}>
              {curLevelIndex === -1
                ? "CONSTRUCTION REQUIREMENTS"
                : `LEVEL 0${
                    station.levels[curLevelIndex].level + 1
                  } UPGRADE REQUIREMENTS`}
            </p>
            <ConstructRequirements level={station.levels[nextLevelIndex]} />
          </>
        )}

      {/* craft */}
      {curLevelIndex !== -1 &&
        !showUpgrade &&
        station.levels[curLevelIndex].crafts.length > 0 && [
          <p key="craft_heading" className="text-center fs-3">
            PRODUCTION
          </p>,
          <div key="crafts">
            {station.levels.map((lvl) => {
              return lvl.crafts.map((c, i) => {
                if (lvl.level <= station.levels[curLevelIndex].level)
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
      {/* buttons */}
      {curLevelIndex === -1 && (
        <TarkovStyleButton
          text="CONSTRUCT"
          clickHandle={increaseLevelHandle}
          height={50}
        />
      )}
      {curLevelIndex !== -1 &&
        !showUpgrade &&
        station.levels[nextLevelIndex] && (
          <TarkovStyleButton
            key="upgradeable_show_upgrade"
            text="UPGRADE"
            clickHandle={showUpgradeHandle}
            height={50}
          />
        )}
      {showUpgrade && [
        <TarkovStyleButton
          key="upgradeable_back"
          text="BACK"
          clickHandle={showUpgradeHandle}
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
