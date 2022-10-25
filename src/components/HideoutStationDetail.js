import React, { useState } from "react"
import { useEffect } from "react"
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
  // hooks state
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [meetReq, setMeetReq] = useState(false)

  // hooks effect
  useEffect(() => {
    setShowUpgrade(false)
  }, [curLevelIndex])

  // handle
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
          constructUnlock={true}
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
      <div
        className="d-flex justify-content-center"
        style={{ backgroundColor: "#1e1e1e" }}
      >
        {curLevelIndex === -1 && (
          <div className="my-1">
            <TarkovStyleButton
              fs={24}
              text="CONSTRUCT"
              color={meetReq ? "#e7e5d4" : "#595853"}
              clickHandle={increaseLevelHandle}
              height={50}
              useAnim={true}
            />
          </div>
        )}
        {curLevelIndex !== -1 &&
          !showUpgrade &&
          station.levels[nextLevelIndex] && (
            <div className="my-1">
              <TarkovStyleButton
                fs={24}
                key="upgradeable_show_upgrade"
                text={`LEVEL ${curLevelIndex + 2}`}
                color={meetReq ? "#e7e5d4" : "#595853"}
                clickHandle={showUpgradeHandle}
                height={50}
                useAnim={true}
              />
            </div>
          )}
        {showUpgrade && [
          <div key="upgradeable_back" className="flex-fill my-1">
            <div className="d-flex justify-content-center">
              <TarkovStyleButton
                fs={24}
                text="BACK"
                color={meetReq ? "#e7e5d4" : "#595853"}
                clickHandle={showUpgradeHandle}
                height={50}
                useAnim={true}
              />
            </div>
          </div>,
          <div key="upgradeable_upgrade" className="flex-fill my-1">
            <div className="d-flex justify-content-center">
              <TarkovStyleButton
                fs={24}
                text="UPGRADE"
                color={meetReq ? "#e7e5d4" : "#595853"}
                clickHandle={() => {
                  increaseLevelHandle()
                }}
                height={50}
                useAnim={true}
              />
            </div>
          </div>,
        ]}
      </div>
    </div>
  )
}

export { HideoutStationDetail }
