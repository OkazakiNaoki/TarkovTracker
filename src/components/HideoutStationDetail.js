import React, { useState } from "react"
import { useEffect } from "react"
import { formatInHoursMINsec, getHMSfromS } from "../helpers/TimeFormat"
import { ConstructRequirements } from "./ConstructRequirements"
import { CraftTimeRequirement } from "./CraftTimeRequirement"
import { HideoutIcon } from "./HideoutIcon"
import { ItemRequirement } from "./ItemRequirement"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { TextStroke } from "./TextStroke"

const HideoutStationDetail = ({
  station,
  curLevelIndex,
  increaseLevelHandle,
}) => {
  // hooks state
  const [showUpgrade, setShowUpgrade] = useState(false)
  const [meetHideoutReq, setMeetHideoutReq] = useState(true)
  const [meetItemReq, setMeetItemReq] = useState(true)
  const [meetTraderReq, setMeetTraderReq] = useState(true)
  const [meetSkillReq, setMeetSkillReq] = useState(true)

  // special case when constructing station have no requirement
  useEffect(() => {
    if (
      station.levels[curLevelIndex + 1] &&
      station.levels[curLevelIndex + 1].itemRequirements.length === 0 &&
      station.levels[curLevelIndex + 1].skillRequirements.length === 0 &&
      station.levels[curLevelIndex + 1].stationLevelRequirements.length === 0 &&
      station.levels[curLevelIndex + 1].traderRequirements.length === 0
    ) {
      setMeetHideoutReq(true)
      setMeetItemReq(true)
      setMeetTraderReq(true)
      setMeetSkillReq(true)
    }
  })

  // hooks effect
  useEffect(() => {
    setShowUpgrade(false)
  }, [curLevelIndex])

  // handle
  const showUpgradeHandle = () => {
    setShowUpgrade(!showUpgrade)
  }

  return (
    <div className="hideout-station-detail">
      {/* heading */}
      <div className="hideout-heading">
        <HideoutIcon
          iconName={station.id}
          level={curLevelIndex + 1}
          noHover={true}
          constructUnlock={
            meetHideoutReq && meetItemReq && meetTraderReq && meetSkillReq
          }
          greenOutlined={
            curLevelIndex === -1 &&
            meetHideoutReq &&
            meetItemReq &&
            meetTraderReq &&
            meetSkillReq
          }
          redOutlined={
            curLevelIndex === -1 &&
            (!meetHideoutReq || !meetItemReq || !meetTraderReq || !meetSkillReq)
          }
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
      <div className="hideout-desc">
        <p>
          {showUpgrade
            ? station.levels[curLevelIndex + 1].description
            : station.levels[curLevelIndex !== -1 ? curLevelIndex : 0]
                .description}
        </p>
      </div>
      {/* station construct/upgrade requirement */}
      {(curLevelIndex === -1 || showUpgrade) &&
        station.levels[curLevelIndex + 1] &&
        (station.levels[curLevelIndex + 1].itemRequirements.length > 0 ||
          station.levels[curLevelIndex + 1].skillRequirements.length > 0 ||
          station.levels[curLevelIndex + 1].stationLevelRequirements.length >
            0 ||
          station.levels[curLevelIndex + 1].traderRequirements.length > 0) && (
          <>
            <p className="hideout-construct-heading">
              {curLevelIndex === -1
                ? "CONSTRUCTION REQUIREMENTS"
                : `LEVEL 0${curLevelIndex + 2} UPGRADE REQUIREMENTS`}
            </p>

            <ConstructRequirements
              level={station.levels[curLevelIndex + 1]}
              showFulfill={true}
              useMeetReq={true}
              setMeetHideoutReq={setMeetHideoutReq}
              setMeetItemReq={setMeetItemReq}
              setMeetTraderReq={setMeetTraderReq}
              setMeetSkillReq={setMeetSkillReq}
            />
          </>
        )}

      {/* craft */}
      {curLevelIndex !== -1 &&
        !showUpgrade &&
        station.levels[curLevelIndex].crafts.length > 0 && [
          <p key="craft_heading" className="hideout-produce-heading">
            PRODUCTION
          </p>,
          <div key="crafts" className="hideout-crafts">
            {station.levels.map((level) => {
              return level.crafts.map((craft, i) => {
                if (level.level <= station.levels[curLevelIndex].level) {
                  return (
                    <div key={station.name + craft.level + "craft_" + i}>
                      {Array.isArray(craft.requiredItems) &&
                        craft.requiredItems.map((itemReq, i) => {
                          return (
                            <div
                              key={`itemRequire_${i}`}
                              className="hideout-crafts-item"
                            >
                              <ItemRequirement
                                itemId={itemReq.item.id}
                                itemName={itemReq.item.name}
                                bgColor={itemReq.item.backgroundColor}
                                reqAmount={itemReq.count}
                              />
                            </div>
                          )
                        })}

                      <CraftTimeRequirement
                        timeStr={formatInHoursMINsec(
                          getHMSfromS(craft.duration)
                        )}
                      />

                      {Array.isArray(craft.rewardItems) &&
                        craft.rewardItems.map((itemRew) => {
                          return (
                            <div
                              key={`itemReward_${i}`}
                              className="hideout-crafts-item"
                            >
                              <ItemRequirement
                                itemId={itemRew.item.id}
                                itemName={itemRew.item.name}
                                bgColor={itemRew.item.backgroundColor}
                                reqAmount={itemRew.count}
                              />
                            </div>
                          )
                        })}
                    </div>
                  )
                }
              })
            })}
          </div>,
        ]}
      {/* buttons */}
      <div className="d-flex justify-content-center bg-black5">
        {curLevelIndex === -1 && (
          <div className="my-1">
            <TarkovStyleButton
              fs={24}
              text="CONSTRUCT"
              color={
                meetHideoutReq && meetItemReq && meetTraderReq && meetSkillReq
                  ? "#e7e5d4"
                  : "#595853"
              }
              clickHandle={increaseLevelHandle}
              height={50}
              useAnim={true}
              lockButton={
                !meetHideoutReq ||
                !meetItemReq ||
                !meetTraderReq ||
                !meetSkillReq
              }
            />
          </div>
        )}
        {curLevelIndex !== -1 &&
          !showUpgrade &&
          station.levels[curLevelIndex + 1] && (
            <div className="my-1">
              <TarkovStyleButton
                fs={24}
                key="upgradeable_show_upgrade"
                text={`LEVEL ${curLevelIndex + 2}`}
                color={"#e7e5d4"}
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
                color={"#e7e5d4"}
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
                color={
                  meetHideoutReq && meetItemReq && meetTraderReq && meetSkillReq
                    ? "#e7e5d4"
                    : "#595853"
                }
                clickHandle={() => {
                  increaseLevelHandle()
                }}
                height={50}
                useAnim={true}
                lockButton={
                  !meetHideoutReq ||
                  !meetItemReq ||
                  !meetTraderReq ||
                  !meetSkillReq
                }
              />
            </div>
          </div>,
        ]}
      </div>
    </div>
  )
}

export { HideoutStationDetail }
