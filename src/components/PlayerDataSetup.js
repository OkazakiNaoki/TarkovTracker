import React, { useState, useEffect } from "react"
import { Container, Image, Row, Col } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
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
  const [hoverPlayerLvl, setHoverPlayerLvl] = useState(false)
  const [openCloseLevelModal, setOpenCloseLevelModal] = useState(false)
  const [hoverBearIcon, setHoverBearIcon] = useState(false)
  const [hoverUsecIcon, setHoverUsecIcon] = useState(false)
  const [hoverStdEditionIcon, setHoverStdEditionIcon] = useState(false)
  const [hoverLbEditionIcon, setHoverLbEditionIcon] = useState(false)
  const [hoverPfeEditionIcon, setHoverPfeEditionIcon] = useState(false)
  const [hoverEodEditionIcon, setHoverEodEditionIcon] = useState(false)
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
  const hoverOnLevelSetupBtn = () => {
    setHoverPlayerLvl(!hoverPlayerLvl)
  }
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
  const hoverOnBearBtn = () => {
    setHoverBearIcon(!hoverBearIcon)
  }
  const hoverOnUsecBtn = () => {
    setHoverUsecIcon(!hoverUsecIcon)
  }
  const hoverOnStdEdition = () => {
    setHoverStdEditionIcon(!hoverStdEditionIcon)
  }
  const hoverOnLbEdition = () => {
    setHoverLbEditionIcon(!hoverLbEditionIcon)
  }
  const hoverOnPfeEdition = () => {
    setHoverPfeEditionIcon(!hoverPfeEditionIcon)
  }
  const hoverOnEodEdition = () => {
    setHoverEodEditionIcon(!hoverEodEditionIcon)
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
    <Container key="setup_panel" className="my-5">
      <div className="d-flex align-content-center justify-content-center align-items-center flex-wrap">
        <div className="w-100 d-flex justify-content-center mb-5 fs-1 sandbeige">
          Initial setup
        </div>
        <div
          className="px-2 py-1 fs-3"
          style={{
            width: "60%",
            borderBottom: "1px solid #b7ad9c",
            borderTop: "1px solid #b7ad9c",
          }}
        >
          Character level
        </div>
        <div className="w-100 d-flex justify-content-center mt-3 mb-5">
          <div
            className="sandbeige px-5 pb-3"
            role="button"
            style={{
              fontSize: "90px",
              border: hoverPlayerLvl
                ? "1px solid #9a8866"
                : "1px solid #b7ad9c",
              boxShadow: hoverPlayerLvl ? "0 0 20px 5px #9a8866" : null,
              borderRadius: "15px",
            }}
            onMouseEnter={hoverOnLevelSetupBtn}
            onMouseLeave={hoverOnLevelSetupBtn}
            onClick={() => {
              setOpenCloseLevelModal(!openCloseLevelModal)
            }}
          >
            <Image
              src={levelIcon}
              className="d-inline me-3"
              style={{ height: "100px" }}
            />
            {localPlayerLevel}
          </div>
        </div>
        <div
          className="px-2 py-1 fs-3"
          style={{
            width: "60%",
            borderBottom: "1px solid #b7ad9c",
            borderTop: "1px solid #b7ad9c",
          }}
        >
          Faction
        </div>
        <div className="w-100 d-flex justify-content-center my-3">
          <div
            role="button"
            style={{
              boxShadow:
                hoverBearIcon || factionPick === "bear"
                  ? "0 0 20px 5px #9a8866"
                  : null,
              borderRadius: "15px",
            }}
            onMouseEnter={hoverOnBearBtn}
            onMouseLeave={hoverOnBearBtn}
            onClick={() => {
              setFactionPick("BEAR")
            }}
          >
            <Image src={bearIcon} />
          </div>
          <div
            role="button"
            style={{
              boxShadow:
                hoverUsecIcon || factionPick === "usec"
                  ? "0 0 20px 5px #9a8866"
                  : null,
              borderRadius: "15px",
            }}
            onMouseEnter={hoverOnUsecBtn}
            onMouseLeave={hoverOnUsecBtn}
            onClick={() => {
              setFactionPick("USEC")
            }}
          >
            <Image src={usecIcon} />
          </div>
        </div>
        <div
          className="px-2 py-1 fs-3"
          style={{
            width: "60%",
            borderBottom: "1px solid #b7ad9c",
            borderTop: "1px solid #b7ad9c",
          }}
        >
          Game edition
        </div>
        <div className="w-100 d-flex justify-content-center my-3">
          <Row>
            <Col>
              <div
                role="button"
                style={{
                  boxShadow:
                    hoverStdEditionIcon || gameEditionPick === "standard"
                      ? "0 0 20px 5px #9a8866"
                      : null,
                  borderRadius: "15px",
                }}
                onMouseEnter={hoverOnStdEdition}
                onMouseLeave={hoverOnStdEdition}
                onClick={() => {
                  setGameEditionPick("standard")
                }}
                title="standard"
              >
                <Image
                  src="/asset/preorder_standard.png"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            </Col>
            <Col>
              <div
                role="button"
                style={{
                  boxShadow:
                    hoverLbEditionIcon || gameEditionPick === "left behind"
                      ? "0 0 20px 5px #9a8866"
                      : null,
                  borderRadius: "15px",
                }}
                onMouseEnter={hoverOnLbEdition}
                onMouseLeave={hoverOnLbEdition}
                onClick={() => {
                  setGameEditionPick("left behind")
                }}
                title="left behind"
              >
                <Image
                  src="/asset/preorder_left_behind.png"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            </Col>
            <Col>
              <div
                role="button"
                style={{
                  boxShadow:
                    hoverPfeEditionIcon ||
                    gameEditionPick === "prepare for escape"
                      ? "0 0 20px 5px #9a8866"
                      : null,
                  borderRadius: "15px",
                }}
                onMouseEnter={hoverOnPfeEdition}
                onMouseLeave={hoverOnPfeEdition}
                onClick={() => {
                  setGameEditionPick("prepare for escape")
                }}
                title="prepare for escape"
              >
                <Image
                  src="/asset/preorder_prepare_for_escape.png"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            </Col>
            <Col>
              <div
                role="button"
                style={{
                  boxShadow:
                    hoverEodEditionIcon ||
                    gameEditionPick === "edge of darkness"
                      ? "0 0 20px 5px #9a8866"
                      : null,
                  borderRadius: "15px",
                }}
                onMouseEnter={hoverOnEodEdition}
                onMouseLeave={hoverOnEodEdition}
                onClick={() => {
                  setGameEditionPick("edge of darkness")
                }}
                title="edge of darkness"
              >
                <Image
                  src="/asset/preorder_edge_of_darkness.png"
                  style={{ maxWidth: "200px" }}
                />
              </div>
            </Col>
          </Row>
        </div>

        <div className="w-100 d-flex justify-content-center my-3">
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
