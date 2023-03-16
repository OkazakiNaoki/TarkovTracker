import React, { memo, useCallback, useEffect, useState } from "react"
import { Row, Col, Container, Image } from "react-bootstrap"
import { useDispatch, useSelector } from "react-redux"
import { LoginFirst } from "../components/LoginFirst"
import {
  getTasksOfTraderWithLevel,
  getCompletedObjectives,
  getObjectiveProgress,
  getCharacterData,
  updateCharacterData,
  getHideoutLevel,
  getTraderProgress,
  getSkillProgress,
  getUnlockedTrader,
} from "../reducers/CharacterSlice"
import { getLevelReqOfTrader, getTasksOfTrader } from "../reducers/TraderSlice"
import { PlayerDataSetup } from "../components/PlayerDataSetup"
import { EditValueModal } from "../components/EditValueModal"
import { PlayerLevelPanel } from "../components/PlayerLevelPanel"
import { PlayerCharacterPanel } from "../components/PlayerCharacterPanel"
import leftArrow from "../../server/public/static/images/left_arrow.png"
import rightArrow from "../../server/public/static/images/icon_right_bracket.png"

const MemoPlayerLevelPanel = memo(PlayerLevelPanel)
const MemoPlayerCharacterPanel = memo(PlayerCharacterPanel)

const CharacterScreen = () => {
  // useEffect(() => {
  //   console.log("debug: character page rerendered")
  // })
  //// state
  const [hideLevelPanel, setHideLevelPanel] = useState(false)
  // player basic data
  const [openPlayerLevelModal, setOpenPlayerLevelModal] = useState(false)

  //// redux
  const dispatch = useDispatch()

  //// redux state
  const { user } = useSelector((state) => state.user)
  const { traders, tasks, traderLevels } = useSelector((state) => state.trader)
  const {
    initSetup,
    loadingInitSetup,
    playerLevel,
    playerFaction,
    gameEdition,
    playerTasksInfo,
    unlockedTraders,
    traderProgress,
    playerCompletedObjectives,
    playerObjectiveProgress,
    playerHideoutLevel,
    playerInventory,
    playerSkill,
  } = useSelector((state) => state.character)

  //// effect
  // get tasks of all traders
  useEffect(() => {
    if (traders.length !== 0 && Object.keys(tasks).length !== traders.length) {
      for (let i = 0; i < traders.length; i++) {
        if (!tasks.hasOwnProperty(traders[i].name)) {
          dispatch(
            getTasksOfTrader({
              trader: traders[i].name,
            })
          )
        } else {
          continue
        }
      }
    }
  }, [traders, tasks])

  // get trader loyalty level stage data
  useEffect(() => {
    if (!traderLevels) {
      traders.forEach((trader) => {
        dispatch(getLevelReqOfTrader({ trader: trader.name }))
      })
    }
  }, [traderLevels])

  /// player data
  // get player's character data
  useEffect(() => {
    if (Object.keys(user).length > 0 && !initSetup) {
      dispatch(getCharacterData())
    }
  }, [user])

  // get player's hideout station level
  useEffect(() => {
    if (initSetup && !playerHideoutLevel) {
      dispatch(getHideoutLevel())
    }
  }, [initSetup, playerHideoutLevel])

  // get player's completed objectives of task
  useEffect(() => {
    if (initSetup && !playerCompletedObjectives) {
      dispatch(getCompletedObjectives())
    }
  }, [initSetup, playerCompletedObjectives])

  // get player's objective progress of task
  useEffect(() => {
    if (initSetup && !playerObjectiveProgress) {
      dispatch(getObjectiveProgress())
    }
  }, [initSetup, playerObjectiveProgress])

  // get player's trader progress
  useEffect(() => {
    if (
      initSetup &&
      traderLevels &&
      Object.keys(traderLevels).length === traders.length &&
      !traderProgress
    ) {
      dispatch(getTraderProgress())
    }
  }, [initSetup, traderLevels, traderProgress])

  // get player's unlocked traders
  useEffect(() => {
    if (initSetup && !unlockedTraders) {
      dispatch(getUnlockedTrader())
    }
  }, [initSetup, unlockedTraders])

  // get player's skill progress
  useEffect(() => {
    if (initSetup && !playerSkill) {
      dispatch(getSkillProgress())
    }
  }, [initSetup, playerSkill])

  //// handle
  const adjustPlayerLevelHandle = (level) => {
    dispatch(updateCharacterData({ characterLevel: level }))
    traders.forEach((trader) => {
      dispatch(
        getTasksOfTraderWithLevel({
          trader: trader.name,
          level: level,
        })
      )
    })
  }

  const openCloseLevelModalHandle = useCallback(() => {
    setOpenPlayerLevelModal(!openPlayerLevelModal)
  }, [openPlayerLevelModal])

  const hideShowCharacterLevelHandle = useCallback(() => {
    setHideLevelPanel(!hideLevelPanel)
  }, [hideLevelPanel])

  const setPlayerLevelHandle = (level) => {
    adjustPlayerLevelHandle(level)
    openCloseLevelModalHandle()
  }

  return (
    <>
      <div
        className="hide-level-sticky-btn"
        role="button"
        onClick={hideShowCharacterLevelHandle}
      >
        <Image src={hideLevelPanel ? rightArrow : leftArrow} />
      </div>
      <EditValueModal
        title="Player level"
        show={openPlayerLevelModal}
        value={playerLevel}
        maxValue={79}
        setValueHandle={setPlayerLevelHandle}
        closeHandle={openCloseLevelModalHandle}
      />

      {Object.keys(user).length === 0 && <LoginFirst />}
      {Object.keys(user).length > 0 && !initSetup && !loadingInitSetup && (
        <PlayerDataSetup />
      )}
      {Object.keys(user).length > 0 && initSetup && (
        <Container>
          <Row className="my-5 gx-5 align-items-start">
            {/* level panel part */}
            <MemoPlayerLevelPanel
              hide={hideLevelPanel}
              initSetup={initSetup}
              gameEdition={gameEdition}
              playerLevel={playerLevel}
              playerFaction={playerFaction}
              playerHideoutLevel={playerHideoutLevel}
              openCloseLevelModalHandle={openCloseLevelModalHandle}
            />
            {/* tab part */}
            <Col>
              <MemoPlayerCharacterPanel
                traders={traders}
                tasks={tasks}
                unlockedTraders={unlockedTraders}
                playerLevel={playerLevel}
                playerInventory={playerInventory}
                playerSkill={playerSkill}
                traderProgress={traderProgress}
                playerTasksInfo={playerTasksInfo}
                playerHideoutLevel={playerHideoutLevel}
              />
            </Col>
          </Row>
        </Container>
      )}
    </>
  )
}

export { CharacterScreen }
