import React, { useState, useEffect } from "react"
import { Container, Image, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import classNames from "classnames"
import { TarkovStyleButton } from "./TarkovStyleButton"
import { EditValueModal } from "./EditValueModal"
import {
  addCharacterData,
  addObjectiveProgress,
  addCompletedObjectives,
  addCompletedTasks,
  addHideoutLevel,
  addInventoryItem,
  addTraderProgress,
  addSkillProgress,
  addUnlockedTrader,
  addUnlockedOffer,
} from "../reducers/CharacterSlice"
import { getAllHideout } from "../reducers/HideoutSlice"
import { getTaskItemRequirements } from "../reducers/TraderSlice"
import { addUserPreference } from "../reducers/UserSlice"
import { skillIconMap } from "../data/SkillIconMap"
import bearIcon from "../../server/public/static/images/icon_bear.png"
import usecIcon from "../../server/public/static/images/icon_usec.png"

const PlayerDataSetup = () => {
  // hooks state
  const [localPlayerLevel, setLocalPlayerLevel] = useState(1)
  const [openCloseLevelModal, setOpenCloseLevelModal] = useState(false)
  const [factionPick, setFactionPick] = useState(null)
  const [gameEditionPick, setGameEditionPick] = useState(null)
  const [levelIcon, setLevelIcon] = useState("/asset/rank5.png")

  // redux state
  const { hideout } = useSelector((state) => state.hideout)
  const { traders, taskItemRequirement } = useSelector((state) => state.trader)
  const dispatch = useDispatch()

  // hooks effects
  useEffect(() => {
    if (!hideout) {
      dispatch(getAllHideout())
    }
  }, [hideout])

  useEffect(() => {
    if (taskItemRequirement.length === 0) {
      dispatch(getTaskItemRequirements())
    }
  }, [taskItemRequirement])

  // handles
  const openLevelModalHandle = () => {
    setOpenCloseLevelModal(!openCloseLevelModal)
  }

  const setLevelIconHandle = (lvl) => {
    for (let i = 1; i <= 16; i++) {
      if (lvl >= 5 * i) {
        continue
      } else {
        setLevelIcon(`/asset/rank${5 * i}.png`)
        break
      }
    }
  }

  const finishSetupHandle = () => {
    if (hideout && factionPick && gameEditionPick) {
      // user's helper preference
      dispatch(
        addUserPreference({
          preference: {
            showCompletedTaskItemReq: false,
            questItemsFilterDelay: 1,
            fleaMarketItemIconResolution: 64,
          },
        })
      )
      // player basic data
      dispatch(
        addCharacterData({
          characterLevel: localPlayerLevel,
          characterFaction: factionPick,
          gameEdition: gameEditionPick,
        })
      )
      // player hideout data
      const initHideoutLevel = hideout.map((station) => {
        let stashLevelIdx = 0
        if (gameEditionPick === "edge of darkness") {
          stashLevelIdx = 3
        } else if (gameEditionPick === "prepare for escape") {
          stashLevelIdx = 2
        } else if (gameEditionPick === "left behind") {
          stashLevelIdx = 1
        }
        return {
          hideoutId: station.id,
          level: station.id === "5d484fc0654e76006657e0ab" ? stashLevelIdx : -1,
        }
      })
      dispatch(addHideoutLevel({ hideoutLevel: initHideoutLevel }))
      // player task data
      dispatch(addCompletedTasks({ completeTasks: [] }))
      dispatch(addCompletedObjectives({ completeObjectives: [] }))
      dispatch(addObjectiveProgress({ objectiveProgress: [] }))
      // player trader progress
      const traderRep = {}
      const traderSpent = {}
      traders.forEach((trader) => {
        traderRep[trader.name] =
          gameEditionPick === "prepare for escape" ||
          gameEditionPick === "edge of darkness"
            ? 0.2
            : 0
        traderSpent[trader.name] = 0
      })
      dispatch(addTraderProgress({ traderRep, traderSpent }))
      // player unlocked traders
      dispatch(
        addUnlockedTrader({
          traders: [{ traderName: "Jaeger", unlocked: false }],
        })
      )
      // player unlocked offers
      dispatch(addUnlockedOffer())
      // player inventory data
      dispatch(addInventoryItem({ itemList: [] }))
      // player skill data
      const newSkills = []
      Object.keys(skillIconMap).forEach((skill) => {
        newSkills.push({ skillName: skill, level: 1 })
      })
      dispatch(addSkillProgress({ skills: newSkills }))
    }
  }

  return [
    <EditValueModal
      key="modal_of_level"
      title="Player level"
      show={openCloseLevelModal}
      value={1}
      maxValue={79}
      setValueHandle={(v) => {
        setLevelIconHandle(v)
        setLocalPlayerLevel(v)
        openLevelModalHandle()
      }}
      closeHandle={openLevelModalHandle}
    />,
    <Container key="setup_panel" className="initial-player-data">
      <div>
        <div>Initial setup</div>
        <div>Character level</div>
        <div>
          <div
            role="button"
            onClick={() => {
              setOpenCloseLevelModal(!openCloseLevelModal)
            }}
          >
            <Image src={levelIcon} />
            {localPlayerLevel}
          </div>
        </div>
        <div>Faction</div>
        <div>
          <div
            role="button"
            className={classNames({
              "init-setup-selected": factionPick === "BEAR",
            })}
            onClick={() => {
              setFactionPick("BEAR")
            }}
          >
            <Image src={bearIcon} />
          </div>
          <div
            role="button"
            className={classNames({
              "init-setup-selected": factionPick === "USEC",
            })}
            onClick={() => {
              setFactionPick("USEC")
            }}
          >
            <Image src={usecIcon} />
          </div>
        </div>
        <div>Game edition</div>
        <div>
          <Row>
            <Col>
              <div
                role="button"
                className={classNames({
                  "init-setup-selected": gameEditionPick === "standard",
                })}
                onClick={() => {
                  setGameEditionPick("standard")
                }}
                title="standard"
              >
                <Image src="/asset/preorder_standard.png" />
              </div>
            </Col>
            <Col>
              <div
                role="button"
                className={classNames({
                  "init-setup-selected": gameEditionPick === "left behind",
                })}
                onClick={() => {
                  setGameEditionPick("left behind")
                }}
                title="left behind"
              >
                <Image src="/asset/preorder_left_behind.png" />
              </div>
            </Col>
            <Col>
              <div
                role="button"
                className={classNames({
                  "init-setup-selected":
                    gameEditionPick === "prepare for escape",
                })}
                onClick={() => {
                  setGameEditionPick("prepare for escape")
                }}
                title="prepare for escape"
              >
                <Image src="/asset/preorder_prepare_for_escape.png" />
              </div>
            </Col>
            <Col>
              <div
                role="button"
                className={classNames({
                  "init-setup-selected": gameEditionPick === "edge of darkness",
                })}
                onClick={() => {
                  setGameEditionPick("edge of darkness")
                }}
                title="edge of darkness"
              >
                <Image src="/asset/preorder_edge_of_darkness.png" />
              </div>
            </Col>
          </Row>
        </div>

        <div>
          <TarkovStyleButton
            text="Finish"
            clickHandle={finishSetupHandle}
            fs={24}
            height={60}
          />
        </div>
      </div>
    </Container>,
  ]
}

export { PlayerDataSetup }
